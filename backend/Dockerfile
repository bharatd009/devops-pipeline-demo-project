FROM node:argon

# Install netcat
RUN apt-get update
RUN apt-get install netcat -y

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8030

CMD [ "npm", "start" ]
