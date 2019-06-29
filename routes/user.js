var express = require('express');
var router = express.Router();
var GitHub = require('github-api');

// Generate the github api client using the auth token.
// The auth token should be stored in a DB and retrieved using a Configuration service.
// However, for the purposes of this application, I will comment it out and inform'
// The devs to replace this token with a valid one. 
var gitHubClient = new GitHub({
    token: 'TODO - replace with OAUTH token'
});

/**
 * GET endpoint for retrieving organization contribution information.
 * Query parameter for visibility determines whether or not the user is
 * internal or external.
 */
router.get('/get-top-contributor/:visibility', function(req, res, next) {
    res.send('TODO implement')
});

module.exports = router;
