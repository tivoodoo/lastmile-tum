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
- Enter 'npm install' and confirm. The process automatically installs node dependencies
- Maybe you need administrative privileges - then enter 'sudo npm install'
- Enter 'bower install' and confirm
- Enter 'gulp' and confirm
- The website opens automatically

## What happens when running gulp
- JavaScript frameworks installed with bower are minified and copied to dist/js
- JavaScripts contained in scripts are combined with the JavaScript frameworks (i.e., those installed with bower) into one single, minified file
- Stylesheets contained in styles (including the imported bower frameworks) are compiled to CSS (if necessary), minified into one single file and copied to dist/css
- Files contained in docroot are copied to the dist/ directory
- HTML files, JavaScripts and stylesheets are injected automatically

## Config production environment (especially for use on multiple devices)

### Disable browser-sync:
By default the web application will use browser-sync for testing purpose.
So all user will see the same page and reaction if they connect to backend.

- The terminal should show the follwing lines (with your IPs):

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
where $YOUR_IP_ADDRESS$ can be seen after starting frontend server with gulp like above (E.g. http://192.168.56.1)

### Access Site externally
To access the website from another machine or mobile device open http://YOUR_IP_Address:3000.

(c) 2017, FullTrunk.