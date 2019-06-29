var express = require('express');
var router = express.Router();
var GitHub = require('github-api');

// Generate the github api client using the auth token.
// The auth token should be stored in a DB and retrieved using a Configuration service.
// However, for the purposes of this application, I will comment it out and inform'
// The devs to replace this token with a valid one. 
var gitHubClient = new GitHub({
    token: 'ab20b6643f97dd14d28eb9c61b28aaf397549ae3'
});

/**
 * Sorts the organization repositories using a filter.
 * @param {string} sortType The sort filter
 * @param {array} repos The array of repositories to sort
 */
function sortResultRepositories(sortType, repos) {
    // Potentially simplied further to a mapping of sort types to object keys, and having just one comparator take 
    // in the object key to use for sorting given the sort type.
    if (sortType === 'forks') {
        repos.sort((repo1, repo2) => (repo2.forks_count > repo1.forks_count) ? 1 : ((repo1.forks_count > repo2.forks_count) ? -1 : 0)); 
    } else if (sortType === 'stars') {
        repos.sort((repo1, repo2) => (repo2.stargazers_count > repo1.stargazers_count) ? 1 : ((repo1.stargazers_count > repo2.stargazers_count) ? -1 : 0)); 
    } else if (sortType === 'contributors') {
        repos.sort((repo1, repo2) => (repo2.contributors > repo1.contributors) ? 1 : ((repo1.contributors > repo2.contributors) ? -1 : 0)); 
    }
    return repos;
}

/**
 * GET endpoint for retrieving organization summary information.
 */
router.get('/', function(req, res, next) {
    // We should also implement validation for query name (regex on type of value passed in or use the npm validator package)
    var sortType = req.query.sort;
    var organizationName = req.query.name;
    var organization = gitHubClient.getOrganization(organizationName);
    var organizationRepos = [];
    organization.getRepos(function(err, repos) {
        if (err) {
            // TODO - Handle error messaging in the future
        }
        // I believe to get the number of contributors, I need to call - https://developer.github.com/v3/repos/#list-contributors
        // The current endpoint does not return any information about how many contributors belong to a repository.
        // We would need to call a GET endpoint for each repository that exists within the returned list.
        // This is very slow,  but is needed because as of right now the only way to get the number of contributors for a 
        // repository is to first get the organization's repositories. Then we need to make an API call to get the contributors
        // endpoint for each repository to get the total number of contributors. Lastly, we can sort on the number of contributors.
        repos.forEach(function(repo) {
            var repository = gitHubClient.getRepo(organizationName, repo.name);
            repository.getContributors(function(err, response) {
                repo['contributors'] = response.length;
                // Simply returns the top contributor of the current repository. 
                // This does not answer the question of returning the top contribution user is in the organization, and also a public
                // user outside of the organization. I would design that flow by creating a separate rest endpoint + view. 
                repo['topContributor'] = response.length === 0 ? 0 : response.reduce(function(prev, curr) {
                    return prev.contributions < curr.contributions ? prev : curr;
                }).id;
            });
        });

        // TODO - Handle promises in an asynchronous fashion 
        setTimeout(function() {
            repos = sortResultRepositories(sortType, repos, organization);
            res.render(
                'summary', 
                { 
                    organizationName: organizationName, 
                    organizationRepos: repos
                }
            );
        }, 3000);
    });
});

module.exports = router;
