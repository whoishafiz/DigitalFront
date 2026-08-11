# Digital Front — Web Flasher

**AutoMate Vol.1: Low Power Apps · LPA-01 · Age: 16+**

A local digital storefront and backend for small-to-medium businesses —
inventory management, product display, live orders, operational controls.
Branded to your identity. Accessible the moment a guest joins your Wi-Fi.
No internet required.

This repo hosts the browser-based installer for it: buy it on Gumroad, then
flash your ESP32-S3 straight from Chrome or Edge — open `install.html`,
enter your license key, click, done. No build tools needed.

It exists only to host the files a browser needs to flash a device over USB
(ESP Web Tools requires them to be fetchable over HTTP/HTTPS) — it's **not**
an invitation to use the firmware without a purchase. See `LICENSE.txt`.

**Buy Digital Front: [whizworks.gumroad.com/l/ejarzu](https://whizworks.gumroad.com/l/ejarzu)** ($17.50)

## Getting started

1. Purchase on Gumroad → instantly receive a license key + the full source
   code as a zip.
2. Flash via browser: **[whoishafiz.github.io/DigitalFront/install.html](https://whoishafiz.github.io/DigitalFront/install.html)**
   (Chrome or Edge on desktop) — enter your license key, plug in your
   ESP32-S3, click **Connect & Install**.
3. Power on → connect to the device's Wi-Fi → configure via the admin panel
   (`ADMIN_GUIDE.md`, in your downloaded zip).

## Hardware required

- **ESP32-S3 board** — tuned for the ESP32-S3 Super Mini specifically (the
  status LED uses that board's onboard LED on GPIO 48, and the Wi-Fi/USB
  config works around an S3-native-USB quirk). Other ESP32-S3 boards will
  very likely work but haven't been tested; plain ESP32 hasn't been
  ported/tested at all.
- USB power source.

## Building it yourself

Prefer to build from source, or customize before flashing? Everything in
your downloaded zip — `main/`, `build_flash.bat`, `CMakeLists.txt` — is a
complete ESP-IDF project. See `LICENSE.txt` for what you're allowed to do
with the source.

## Status: live

License-key verification is fully wired up and deployed (Gumroad → Worker →
flasher). If you're maintaining this: the Worker lives at
`https://digitalfront.hafizmaiddin.workers.dev/`, source in
`cloudflare-worker.js`. The install page itself is generated —
see `_install_template.html` + `_build_install_html.py`, never hand-edit
`install.html` directly.
