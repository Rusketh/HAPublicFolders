ARG BUILD_FROM
FROM $BUILD_FROM

# Install node js
RUN \
  apk add --no-cache \
    nodejs npm

# Copy run file
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]