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
 */

// Fill this in once the Gumroad listing exists — it's the short code in your
// product's Gumroad URL (gumroad.com/l/THIS_PART), not a secret.
const GUMROAD_PRODUCT_PERMALINK = "ejarzu";

// Only this origin is allowed to call the worker — keeps it from being used
// as a free generic Gumroad-verify proxy by anyone else. Update if the
// flasher page ever moves off GitHub Pages.
const ALLOWED_ORIGIN = "https://whoishafiz.github.io";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

async function verifyLicense(licenseKey, env) {
  const permalink = env?.GUMROAD_PRODUCT_PERMALINK || GUMROAD_PRODUCT_PERMALINK;
  const body = new URLSearchParams({
    product_permalink: permalink,
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

    let licenseKey;
    try {
      ({ license_key: licenseKey } = await request.json());
    } catch {
      return new Response(JSON.stringify({ valid: false, error: "bad request" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }
    if (!licenseKey || typeof licenseKey !== "string") {
      return new Response(JSON.stringify({ valid: false, error: "missing license_key" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    let result;
    try {
      result = await verifyLicense(licenseKey.trim(), env);
    } catch {
      return new Response(JSON.stringify({ valid: false, error: "verification service unreachable" }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  },
};
