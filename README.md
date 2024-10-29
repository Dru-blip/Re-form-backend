
## Project setup

```bash
$ npm install
```

## env variables
create a .env file in the root directory with following variables
```
# mongodb connection string
DATABASE_URL=""

# secret key for validating JWT tokens
JWT_SECRET="random secured string"

# for sending gmails
GMAIL_NAME="your email"
GMAIL_PASSWORD="your gmail app password"
```



## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
