# ============================================================
# Stage 1: Base — install dependencies
# ============================================================
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# ============================================================
# Stage 2: Production image
# ============================================================
FROM node:20-alpine
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY . .

# Media files are stored in this volume — never inside the image
VOLUME ["/app/uploads"]

EXPOSE 4000
CMD ["node", "index.js"]
