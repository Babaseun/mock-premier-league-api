FROM node:14-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
