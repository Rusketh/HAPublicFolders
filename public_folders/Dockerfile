ARG BUILD_FROM
FROM $BUILD_FROM

# Install node js
RUN \
  apk add --no-cache \
    nodejs npm

#Set working directory to then nodeapp directory.
WORKDIR /nodeapp

# Copy run file
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]