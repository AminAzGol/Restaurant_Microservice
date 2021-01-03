FROM node:15-alpine
ENV DB_HOST localhost
ENV DB_USER root
ENV DB_PASS 123456
ENV DB_PASS restaurant
ENV LISTEN_PORT 3000
WORKDIR /app
COPY package*.json /app/
RUN npm i
COPY src /app/src/
COPY test /app/test/
COPY .env /app
EXPOSE 3000
CMD npm run dev