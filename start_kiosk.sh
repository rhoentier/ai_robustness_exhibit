#!/bin/bash
docker compose up -d
sleep 10

 chromium-browser --kiosk --start-maximized --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI --disk-cache-dir=/dev/null  --password-store=basic "http://localhost:9000/"