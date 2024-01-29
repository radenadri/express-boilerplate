# How to run this project

## Clone the repository

    git clone https://github.com/radenadri/express-boilerplate.git
    cd express-boilerplate

## Copy a .env.example into .env file at the app root level for configurations

    NODE_ENV = DEVELOPMENT

    DB_HOST = localhost
    DB_PORT = 5432
    DB_USER = yourusername
    DB_PASSWORD = yourpassword
    DB_DATABASE = yourdbname

    APP_PORT = 8080
    JWT_SECRET_KEY = make-sure-this-secret-key-is-very-secure-in-prod
    API_VERSION = v1

    ORIGIN = http://127.0.0.1:3000

## Install Packages

    npm install

## Start the application in dev mode

    npm run dev

## Run testing

    npm run test

## Start the application in production mode

    npm run build
    npm run start

## Generate SQL migration script

    npm run generate

## Browser SQL editor

    npm run studio

Inspired by this repo : <https://github.com/zacharynoble/express-typescript-postgres-drizzle-auth-template>

Big thanks to the author.
