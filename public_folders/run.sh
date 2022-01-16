#!/usr/bin/with-contenv bashio


PORT = "$(bashio::addon.port '8123')"

bashio::log.info "Starting public folders service on {PORT}"

npm run start 