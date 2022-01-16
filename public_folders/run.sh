#!/usr/bin/with-contenv bashio


PORT = $(bashio::config 'ports.8123/tcp')

bashio::log.info "Starting public folders service on {PORT}"

npm run start 