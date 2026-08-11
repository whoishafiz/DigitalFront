# Digital Front — Web Flasher

Browser-based installer for the **Digital Front** product (AutoMate Vol.1, LPA-04).
Buy it on Gumroad, then flash your ESP32-S3 straight from Chrome or Edge —
open `install.html`, click, done.

This repo exists only to host the files a browser needs to flash a device
over USB (ESP Web Tools requires them to be fetchable over HTTP/HTTPS). It
is **not** an invitation to use the firmware without a purchase — see
`LICENSE.txt`.

Buy Digital Front: **https://whizworks.gumroad.com/l/ejarzu** ($17.50)

## Status: live

License-key verification is fully wired up and deployed (Gumroad → Worker →
flasher). If you're maintaining this: the Worker lives at
`https://digitalfront.hafizmaiddin.workers.dev/`, source in
`cloudflare-worker.js`.
