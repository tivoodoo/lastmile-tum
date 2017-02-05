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

## Config production environment

### Disable browser-sync:
By default the web application will use browser-sync for testing purpose.
So all user will see the same page and reaction if they connect to backend.

- Comment out line ui:false in gulpfile.js
- Start frontend again with gulp
- The terminal should show the follwing lines:

```
[BS] Access URLs:
 -------------------------------------
       Local: http://localhost:3000
    External: http://192.168.56.1:3000
 -------------------------------------
          UI: http://localhost:3001
 UI External: http://192.168.56.1:3001
 -------------------------------------
```

- Go to the UI address and turn off all sync

### Correct database address in production environment:
- Go to lastmile-tum-frontend>app>components>config>appConfig.js
- Edit the following line:
```
    .constant('BACKEND_BASE_URL', "http://localhost:4000")
```
to
```
    .constant('BACKEND_BASE_URL', "$YOUR_IP_ADDRESS$:4000")
```
where $YOUR_IP_ADDRESS$ can be seen after starting frontend server with gulp like above (In my case http://192.168.56.1)
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


(c) 2017, FullTrunk. All rights reserved.
