# Digital Front — ESP32 Captive-Portal Digital Storefront (Browser Web Flasher)

**AutoMate Vol.1: Low Power Apps · LPA-01 · Age: 16+**

An ESP32 captive-portal digital storefront and backend for small-to-medium
businesses — inventory management, product display, live orders,
operational controls. Branded to your identity. No app to install, no
internet connection needed: a guest joins your Wi-Fi and the storefront
opens automatically, the way a hotel or airport Wi-Fi login page does.

This repo hosts the browser-based installer for it: buy it on Gumroad, then
flash your ESP32, ESP32-S3, or ESP32-C3 board straight from Chrome or Edge
— open `install.html`, enter your license key, click, done. No build tools,
no `idf.py`, no drivers to install. ESP32-S3 is hardware-verified; classic
ESP32 and ESP32-C3 are build-verified only (compiles clean, not yet
confirmed on physical hardware) — see `manifest.json`'s per-chip builds.

It exists only to host the files a browser needs to flash a device over USB
(ESP Web Tools requires them to be fetchable over HTTP/HTTPS) — it's **not**
an invitation to use the firmware without a purchase. See `LICENSE.txt`.

**Buy Digital Front: [whizworks.gumroad.com/l/ejarzu](https://whizworks.gumroad.com/l/ejarzu)** ($17.50)

## Getting started

1. Purchase on Gumroad → instantly receive a license key + the full source
   code as a zip.
2. Flash via browser: **[whoishafiz.github.io/DigitalFront/install.html](https://whoishafiz.github.io/DigitalFront/install.html)**
   (Chrome or Edge on desktop) — enter your license key, plug in your
   ESP32, ESP32-S3, or ESP32-C3 board, click **Connect & Install**.
3. Power on → connect to the device's Wi-Fi → configure via the admin panel
   (`ADMIN_GUIDE.md`, in your downloaded zip).

## Hardware required

- **ESP32, ESP32-S3, or ESP32-C3 board (4MB flash minimum)**. ESP32-S3 is
  hardware-verified — tuned for the ESP32-S3 Super Mini specifically (status
  LED on GPIO 48, Wi-Fi/USB config works around an S3-native-USB quirk).
  Classic ESP32 and ESP32-C3 are build-verified only (compiles clean, not
  yet confirmed on physical hardware) — status LED uses a best-guess GPIO
  on those, purely cosmetic if it doesn't match your board.
- USB power source.

## Building it yourself

Prefer to build from source, or customize before flashing? Everything in
your downloaded zip — `main/`, `build_flash.bat`, `CMakeLists.txt` — is a
complete ESP-IDF project. See `LICENSE.txt` for what you're allowed to do
with the source.

### Source delivery (always the latest version)

Buyers download the source from `install.html` after their license key
verifies — the **Download latest source** button. `cloudflare-worker.js`
(`POST /source`) re-checks the key with Gumroad, then streams the current
`main` of the **private** repo `whoishafiz/DigitalFront-source` as a zip, so
nobody gets a stale upload. The button stays hidden until the Worker has a
`GITHUB_TOKEN` secret (fine-grained PAT: that one repo, Contents read-only).

To release a source update, run from the source project:

```
python tools/publish_source.py
```

It pushes an allowlisted copy of the source to `DigitalFront-source` —
that's the whole release; no Worker or Gumroad change needed.

### Rebuilding the firmware binaries

`firmware-esp32s3.bin`/`firmware-esp32.bin`/`firmware-esp32c3.bin` are each
a single merged image (bootloader + partition table + app, via
`esptool.py merge_bin`), always flashed at offset `0x0` — sidesteps the
bootloader-offset difference between chip families (`0x0` for S3/C3,
`0x1000` for classic ESP32). After a firmware change, rebuild all three:

```
idf.py set-target <esp32s3|esp32|esp32c3>
idf.py build
python -m esptool --chip <chip> merge_bin -o flasher/firmware-<chip>.bin \
  --flash_mode dio --flash_freq <from build/flash_args> --flash_size 4MB \
  <0x0 or 0x1000 — see build/flash_args> build/bootloader/bootloader.bin \
  0x8000 build/partition_table/partition-table.bin \
  0x10000 build/cataloggen.bin
```
Repeat per target, then `idf.py set-target esp32s3 && idf.py build` again
to restore the primary dev target before committing.
