#!/usr/bin/with-contenv bashio

set +u

export PORT=$(bashio::addon.port 4123)

bashio::log.info "Starting http service on {PORT}."

npm run start;