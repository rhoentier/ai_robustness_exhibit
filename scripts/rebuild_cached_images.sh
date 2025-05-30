#!/bin/bash

docker compose down

docker volume ls -q | xargs -r docker volume rm

docker compose build
docker compose up -d