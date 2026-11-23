ARG BUILD_ARCH=amd64
FROM ghcr.io/home-assistant/${BUILD_ARCH}-base:3.21
ARG BUILD_ARCH

RUN apk add --no-cache nodejs ca-certificates curl tzdata \
 && case "${BUILD_ARCH}" in \
      amd64) CF=amd64 ;; aarch64) CF=arm64 ;; armv7) CF=arm ;; *) CF=amd64 ;; \
    esac \
 && curl -fsSL -o /usr/bin/cloudflared "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${CF}" \
 && chmod +x /usr/bin/cloudflared

COPY rootfs /
RUN chmod +x /run.sh
CMD [ "/run.sh" ]
