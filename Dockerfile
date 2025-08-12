FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Prisma generate ก่อนคัดลอก src (เพื่อ cache build ได้ดี)
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3210
CMD ["npm", "run", "dev"]
