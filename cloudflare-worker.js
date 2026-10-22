/**
 * Digital Front — license-key relay for install.html
 *
 * Gumroad's own license verification endpoint (v2/licenses/verify) needs no
 * secret/API key at all — anyone can call it with a product id + license key
 * and it says whether that key is real. It just doesn't allow direct browser
 * calls (no CORS headers), so this Worker exists purely to relay the request
 * server-side and hand the answer back to install.html with CORS allowed.
 * There is nothing secret in this file — the product id is public information
 * (it's in every buyer's receipt URL).
 *
 * Deploy: Cloudflare dashboard -> Workers & Pages -> Create -> paste this in
 * -> set GUMROAD_PRODUCT_ID below (or as an Environment Variable, same name)
 * -> Deploy. Copy the resulting *.workers.dev URL into install.html's
 * WORKER_URL constant.
 *
 * IMPORTANT: Gumroad's verify endpoint requires product_id, not
 * product_permalink, for any product created on/after Jan 9 2023 (this one
 * included) — using the permalink silently fails real license checks while
 * *looking* like it works against a bogus key (a bogus key against a
 * permalink still returns a plausible "license does not exist" error,
 * which is what made this look fine in testing until a real key was tried).
 * Get the real product_id from Gumroad's own error message: call the verify
 * endpoint once with the permalink and any key, and it echoes back the
 * required product_id directly.
 *
 * SOURCE DELIVERY (POST /source): after the same license check, streams the
 * latest snapshot of the PRIVATE source repo (SOURCE_REPO@SOURCE_REF) as a
 * zip, so buyers always get the current code instead of whatever zip was
 * last uploaded to Gumroad. Needs one secret, set in the dashboard under
 * Settings -> Variables and Secrets (type: Secret):
 *   GITHUB_TOKEN  fine-grained PAT, repository access = SOURCE_REPO only,
 *                 permission Contents: Read-only. Nothing else.
 * Until GITHUB_TOKEN is set, verify responses carry source_available:false
 * and install.html keeps the download button hidden. Publishing a new
 * version = pushing to SOURCE_REPO (see tools/publish_source.py in the
 * source project) — no Worker or Gumroad change needed.
 */

// Public info, not a secret — this product's Gumroad product_id (not the
// permalink; see the IMPORTANT note above for why that distinction matters).
const GUMROAD_PRODUCT_ID = "QqZBvpF-rmpX26qOn0GiXQ==";

// Only this origin is allowed to call the worker — keeps it from being used
// as a free generic Gumroad-verify proxy by anyone else. Update if the
// flasher page ever moves off GitHub Pages.
const ALLOWED_ORIGIN = "https://whoishafiz.github.io";

// Private repo holding the buyer-facing source; override via env vars.
const SOURCE_REPO = "whoishafiz/DigitalFront-source";
const SOURCE_REF = "main";
const SOURCE_FILENAME = "DigitalFront_Source_latest.zip";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Expose-Headers": "Content-Disposition",
  };
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

// Latest snapshot of the private source repo as a zip. GitHub answers the
// zipball call with a redirect to a short-lived codeload URL; fetch follows it.
async function fetchSourceZip(env) {
  const repo = env?.SOURCE_REPO || SOURCE_REPO;
  const ref = env?.SOURCE_REF || SOURCE_REF;
  const res = await fetch(`https://api.github.com/repos/${repo}/zipball/${encodeURIComponent(ref)}`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "digitalfront-worker",
    },
  });
  if (!res.ok) throw new Error(`github ${res.status}`);
  return res;
}

async function verifyLicense(licenseKey, env) {
  const productId = env?.GUMROAD_PRODUCT_ID || GUMROAD_PRODUCT_ID;
  const body = new URLSearchParams({
    product_id: productId,
    license_key: licenseKey,
    increment_uses_count: "false", // don't consume/inflate the usage counter on every page load
  });

  const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  return { valid: res.ok && data.success === true, uses: data.uses ?? null };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
    }

    const isSource = new URL(request.url).pathname.replace(/\/+$/, "") === "/source";

    let licenseKey;
    try {
      ({ license_key: licenseKey } = await request.json());
    } catch {
      return json({ valid: false, error: "bad request" }, 400);
    }
    if (!licenseKey || typeof licenseKey !== "string") {
      return json({ valid: false, error: "missing license_key" }, 400);
    }

    let result;
    try {
      result = await verifyLicense(licenseKey.trim(), env);
    } catch {
      return json({ valid: false, error: "verification service unreachable" }, 502);
    }

    if (!isSource) {
      return json({ ...result, source_available: Boolean(env?.GITHUB_TOKEN) });
    }

    if (!result.valid) return json({ valid: false, error: "invalid license" }, 403);
    if (!env?.GITHUB_TOKEN) return json({ error: "source download not configured" }, 503);
    let zip;
    try {
      zip = await fetchSourceZip(env);
    } catch {
      return json({ error: "source temporarily unavailable" }, 502);
    }
    return new Response(zip.body, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${SOURCE_FILENAME}"`,
        "Cache-Control": "no-store",
        ...corsHeaders(),
      },
    });
  },
};
