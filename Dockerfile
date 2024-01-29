# select the base image to run the app. We want to run a javascript app, so we use the node runtime image from docker hub
# we can use any image from docker hub. We can also use a custom image that we have created
# node:20-alpine -> node is the image name, 20-alpine is the tag
# alpine is a lightweight version of linux
# we can see complete list of node image tags here: https://hub.docker.com/_/node
FROM node:20-alpine

RUN npm install pm2 -g

RUN addgroup app && adduser -S -G app app

USER app

# set the working directory to /app. This is the directory where the commands will be run. We can use any directory name but /app is a standard convention
WORKDIR /app

# copy everything from the current directory to the PWD (Present Working Directory) inside the container.
# First `.` is the path to the current directory on the host machine. Second `.` is the path to the current directory inside the container i.e., source and destination
# source - current directory on the host machine
# destination - current directory inside the container (/app)
COPY package*.json ./

# change ownership of the /app directory to the app user
USER root

# change ownership of the /app directory to the app user
# chown -R <user>:<group> <directory>
# chown command changes the user and/or group ownership of for given file.
RUN chown -R app:app .

# change the user back to the app user
USER app

RUN npm install

COPY . .

EXPOSE 8080

CMD npm run generate; npm run db:push; npm run build; npm run start

# build the image
# docker build -t express-boilerplate .
    # -t -> tag the image with a name
    # express-boilerplate -> name of the image
    # . -> path to the Dockerfile