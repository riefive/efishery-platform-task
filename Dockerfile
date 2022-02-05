# pull official base image
FROM node:16.13.2-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent

# add app
COPY . ./

# Building app
RUN npm run build

EXPOSE 3000

# Running the app
CMD "npm" "run" "dev"
