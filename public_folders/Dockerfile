ARG BUILD_FROM
FROM $BUILD_FROM

# Install node js
RUN \
  apk add --no-cache \
    nodejs npm

#Copy node file
COPY rootfs /

# Copy run file
RUN chmod a+x rootfs/etc/services/public_folers/run.sh