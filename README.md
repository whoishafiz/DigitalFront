# Digital Front — Web Flasher

Browser-based installer for the **Digital Front** product (AutoMate Vol.1, LPA-04).
Buy it on Gumroad, then flash your ESP32-S3 straight from Chrome or Edge —
open `install.html`, click, done.

This repo exists only to host the files a browser needs to flash a device
over USB (ESP Web Tools requires them to be fetchable over HTTP/HTTPS). It
is **not** an invitation to use the firmware without a purchase — see
`LICENSE.txt`.

Buy Digital Front: **https://whizworks.gumroad.com/l/ejarzu** ($17.50)

## Setup status

1. ✅ Gumroad product permalink (`ejarzu`) confirmed live and wired into
   `cloudflare-worker.js` — verified directly against Gumroad's API
   (returns "license does not exist for the provided product" for a bogus
   key, meaning the product itself resolves correctly).
2. ⬜ **`cloudflare-worker.js` still needs deploying** — Cloudflare
   dashboard → Workers & Pages → Create → paste the file in → Deploy. Copy
   the resulting `*.workers.dev` URL.
3. ⬜ **`install.html`**: set `WORKER_URL` to that deployed address —
   still a `REPLACE_ME` placeholder.
4. ✅ `#buy-link` points at the real listing.

Until step 3 is done, the flasher page loads fine and shows the license-key
box, it just can't successfully verify a key yet — the Verify button will
fail with "could not reach the verification service."
