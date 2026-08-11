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
2. ✅ **`cloudflare-worker.js` deployed** — live at
   `https://digitalfront.hafizmaiddin.workers.dev/`. Verified directly with
   a bogus key: returns `{"valid":false,"uses":null}` with CORS locked to
   `https://whoishafiz.github.io`, exactly as expected.
3. ✅ **`install.html`**: `WORKER_URL` set to the deployed address above.
4. ✅ `#buy-link` points at the real listing.

All four setup steps are done — the flasher should now fully verify real
license keys end to end. Worth one real test purchase to confirm the whole
chain (Gumroad → license key → flasher → flash) before pointing customers
at it.
