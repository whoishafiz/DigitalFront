# Digital Front — Web Flasher

Browser-based installer for the **Digital Front** product (AutoMate Vol.1, LPA-04).
Buy it on Gumroad, then flash your ESP32-S3 straight from Chrome or Edge —
open `install.html`, click, done.

This repo exists only to host the files a browser needs to flash a device
over USB (ESP Web Tools requires them to be fetchable over HTTP/HTTPS). It
is **not** an invitation to use the firmware without a purchase — see
`LICENSE.txt`.

Buy Digital Front: *(Gumroad link goes here once published)*

## One-time setup (3 things to fill in)

1. **Gumroad product**: enable "Generate a unique license key per sale" in
   the product's settings, then note its permalink (the short code in
   `gumroad.com/l/THIS_PART`).
2. **`cloudflare-worker.js`**: set `GUMROAD_PRODUCT_PERMALINK` to that code.
   Deploy via Cloudflare dashboard → Workers & Pages → Create → paste the
   file in → Deploy. Copy the resulting `*.workers.dev` URL.
3. **`install.html`**: set `WORKER_URL` to that URL, and `#buy-link`'s
   `href` to the real Gumroad product page.

Until all three are filled in, the flasher page still loads and shows the
license-key box — it just won't successfully verify anything.
