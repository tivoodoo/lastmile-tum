# fulltrunk-tum
FullTrunk Project - Web App Lab Course

## Prerequisites
- Install Node.js and npm
- Setup MongoDB and make sure it is running

## Setup

### 1) Decompress ZIP-Archive

### 2) Setup Backend
- Open console and navigate to 'lastmile-tum-backend'
- Enter 'npm start' and confirm. The process automatically installs node dependencies and starts node.js
- Maybe you need administrative privileges - then enter 'sudo npm start'
- Backend should be running now

### 3) Setup Frontend
- Open console and navigate to 'lastmile-tum-frontend'
- Enter 'npm start' and confirm. The process automatically installs node dependencies and starts node.js
- Maybe you need administrative privileges - then enter 'sudo npm start'
- Enter 'bower start' and confirm
- Enter 'gulp' and confirm
- The website opens automatically

## What happens when running gulp
- JavaScript frameworks installed with bower are minified and copied to dist/js
- JavaScripts contained in scripts are combined with the JavaScript frameworks (i.e., those installed with bower) into one single, minified file
- Stylesheets contained in styles (including the imported bower frameworks) are compiled to CSS (if necessary), minified into one single file and copied to dist/css
- Files contained in docroot are copied to the dist/ directory
- HTML files, JavaScripts and stylesheets are injected automatically

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
  var SERVER_IP_ADDRESS = "localhost";
```
to
```
  var SERVER_IP_ADDRESS = "$YOUR_IP_ADDRESS$";
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
