#!/bin/bash
docker compose up -d

while ! nc -z localhost 9000; do   
  sleep 1
done

timeout 300 bash -c "until xdpyinfo >/dev/null 2>&1; do sleep 1; done"

DISPLAY=:0 chromium-browser --kiosk --start-maximized --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI "http://localhost:9000/"