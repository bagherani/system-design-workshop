FROM node:18-alpine

WORKDIR /app

COPY dist/package*.json ./

RUN npm ci --only=production

COPY dist/ .

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT}/healthz', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "main.js"]
