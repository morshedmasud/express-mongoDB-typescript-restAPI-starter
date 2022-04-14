# Express, Mongodb, Typescript RestAPI Service

## Technology used
1. Node
2. Express JS
3. Typescript
4. MongoDB

## Features
* User SignIn/SignUp
* Basic Authentication with jwt-http
* OAuth 2.0 (Authentication with Access & Refresh Token)
* Data Validation with JOI
* Unit Testing (Coming Soon)
* Email Verification (Coming Soon)
* Swagger Documentation
* Docker (Coming Soon)

## Setup in your local machine
1. Clone project
```
git clone git@github.com:morshedmasud/express-mongoDB-typescript-restAPI-starter.git
```
2. Go to project root path and install all dependency with
```
yarn install
```
3. Don't forget to create **.env** file as like **.env.example** and put necessary values like DB Info, Email Info
```shell script
cp .env.example .env
```
4. Start your mongodb service.
5. Run the project
```shell script
// development server
yarn run dev

// build project
yarn run build

// production server
yarn run start
```

#### Open the following url for view swagger documentation
## (http://localhost:3031/swagger-docs)
