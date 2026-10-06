FROM node:24-alpine

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4173

WORKDIR /app

RUN addgroup -S -g 10001 tracescope \
    && adduser -S -D -H -u 10001 -G tracescope tracescope

COPY --chown=tracescope:tracescope server.mjs index.html ./
COPY --chown=tracescope:tracescope public/network-path.js public/huawei-import.js public/telecom-knowledge.js public/trace-catalog.js public/docker-ui.js public/agent-memory.js public/system-graph.js public/system-map.canvas ./public/

USER 10001:10001
EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4173/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.mjs"]
