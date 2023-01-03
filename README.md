# crawler

## Instructions to run the crawler locally
- install dependencies -> npm i
- install mongodb locally -> https://www.mongodb.com/docs/v4.4/tutorial/install-mongodb-on-os-x/
- run mongodb as service (MacOS)-> brew services start mongodb-community@4.4  OR  brew services start  mongodb/brew/mongodb-community@4.4
- start the api service -> npm run start
- .env file is attached. It has configuration details.

## Run scheduler
-uncomment startJobScheduler() on line 57 in main.ts to make the web crawler run everyday at 10:00 am.