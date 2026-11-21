#!/usr/bin/with-contenv bashio
# shellcheck shell=bash
bashio::log.info "Avvio di Nexalia..."
cd /app || exit 1
exec node server.js
