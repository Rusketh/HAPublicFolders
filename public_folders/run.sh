#!/usr/bin/with-contenv bashio

declare PORT

PORT = $(bashio::addon.port 4123)

bashio::log.info "Starting public folders service on {PORT}"

npm run start PORT