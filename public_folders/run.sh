#!/usr/bin/with-contenv bashio

port=$(bashio::addon.port 4123)

bashio::log.info "Starting public folders service on {port}"

# Don't execute this when SSH is disabled
if ! bashio::var.has_value "${port}"; then
    bashio::log.info 'No network port is defined in the configuration'.
    exit 0
fi

npm run start port