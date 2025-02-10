FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli 
RUN cd /usr/src/app 

# RUN apk add --no-cache chromium

# ENV GENERATE_SOURCEMAP=false
# ENV CHROME_BIN=/usr/bin/chromium-browser
