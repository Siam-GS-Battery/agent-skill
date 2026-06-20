FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build
# seed is idempotent (ON CONFLICT DO NOTHING); schema comes from the db init mount
CMD ["sh", "-c", "node dist/seed.js && node dist/index.js"]
