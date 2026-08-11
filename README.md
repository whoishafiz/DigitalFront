LPA-01 — Premium Digital Front
AutoMate Vol.1: Low Power Apps Price: $17.50 · Age: 16+

A local digital storefront and backend for small-to-medium businesses. Inventory management, product display, operational controls. Branded to your identity. Accessible the moment a guest joins your WiFi. No internet required.

Hardware required
ESP32-S3 board (tuned for the ESP32-S3 Super Mini specifically — the status LED uses that board's onboard LED on GPIO 48, and the Wi-Fi/USB config works around an S3-native-USB quirk. Other ESP32-S3 boards will very likely work but haven't been tested; plain ESP32 has not been ported/tested at all.)
USB power source

Getting started
Purchase on Gumroad → instantly receive a license key + the full source code as a zip
Flash via browser: https://whoishafiz.github.io/DigitalFront/install.html (Chrome or Edge on desktop — enter your license key, plug in your ESP32-S3, click Connect & Install). No build tools needed for this path.
Power on → connect to device WiFi → configure via admin panel (ADMIN_GUIDE.md)
Prefer to build it yourself, or customize before flashing? Everything in your downloaded zip — main/, build_flash.bat, CMakeLists.txt — is a complete ESP-IDF project. See LICENSE.txt for what you're allowed to do with the source.

# Digital Front — Web Flasher

Browser-based installer for the **Digital Front** product (AutoMate Vol.1, LPA-04).
Buy it on Gumroad, then flash your ESP32-S3 straight from Chrome or Edge —
open `install.html`, click, done.

This repo exists only to host the files a browser needs to flash a device
over USB (ESP Web Tools requires them to be fetchable over HTTP/HTTPS). It
is **not** an invitation to use the firmware without a purchase — see
`LICENSE.txt`.

Buy Digital Front: **https://whizworks.gumroad.com/l/ejarzu** ($17.50)
