FROM node:18-alpine as builder

WORKDIR /client
COPY package.json ./

RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /client/dist /var/www/clients.gigitise.com

# COPY ./nginx/clients.gigitise.com /etc/nginx/sites-available