#!/usr/bin/with-contenv bashio

set +u

export PORT=$(bashio::addon.port 4123)

bashio::log.info "Starting bridge service."

npm run start;