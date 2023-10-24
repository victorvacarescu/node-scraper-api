FROM node:16.15.0
WORKDIR /usr/code
COPY package.json .
RUN npm install
COPY . .
RUN apt-get update && apt-get install -y cron vim
EXPOSE 3000
CMD ["npm", "run", "start:prod"]