#!/bin/bash
docker compose up -d

sleep 10

export DISPLAY=:0

unclutter &

while true; do
    sleep 20
    if ! pgrep -f chromium-browser > /dev/null; then
        chromium-browser --kiosk --start-maximized --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI "http://localhost:9000/" &
    else
        log "Chromium still running"
    fi
done