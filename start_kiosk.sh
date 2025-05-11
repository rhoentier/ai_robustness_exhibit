#!/bin/bash
docker compose up -d
sleep 10

startx /usr/bin/openbox-session -- -nocursor &
sleep 5

DISPLAY=:0 chromium-browser --kiosk --start-fullscreen --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI --disk-cache-dir=/dev/null  --password-store=basic "http://localhost:9000/"