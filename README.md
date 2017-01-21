# lastmile-tum
Lastmile Project - Web App Lab Course

## Getting started

Server runs on:

`http://localhost:3000`

Start NodeJS backend:

`npm start`

OR Start NodeJS backend using Nodemon (Need to install nodemon first: npm install nodemon):

`nodemon ./bin/start-server-backend `

## Start web server

Install dependencies:

`npm install`
`bower install`

Start listening (A new web page will be automatically opened)

`gulp`

#### Config connection to backend from frontend:

In appConfig.js, change

`.constant('BACKEND_BASE_URL', "http://localhost:4000")`

## Directory Structure

```
api/					// your REST api
--folder			    // each folder with model, controller, and routes js
--...
bin/					// executable script to start server
config/					// config files
--config.default.js		// default config
--config.js				// config for website
dump/					// mongodb backup
doc/					// documentation folder
lib/					// third party libraries
node_modules/       	// npm modules
package.json        	// npm dependencies information (this belongs into source control)
test/					// test js scripts
postman/                // PostMan tests to import
```

## Notes

Setting NODE_ENV (See : [Link](http://apmblog.dynatrace.com/2015/07/22/the-drastic-effects-of-omitting-node_env-in-your-express-js-applications/))

    Linux and OSX: export NODE_ENV=production
    Windows: SET NODE_ENV=production


(c) 2016, LastMile. All rights reserved.
