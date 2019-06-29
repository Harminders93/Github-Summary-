# Installation steps
cd into make directory with package.json file
npm install
nodemon bin/www

NOTE - I have not committed oauth tokens to the repository. This means API requests to github won't work unless a file is manually updated. The file in question is organization.js. 

Please update the following line with your oauth token.

var gitHubClient = new GitHub({...});

