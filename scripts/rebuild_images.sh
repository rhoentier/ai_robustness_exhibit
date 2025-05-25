#!/bin/bash

docker compose down

docker volume ls -q | xargs -r docker volume rm

docker compose build --no-cache
docker compose up -d