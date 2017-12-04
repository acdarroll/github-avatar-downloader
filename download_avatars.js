var request = require('request');

console.log('Welcome to the Github avatar downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Error: ", err);
  console.log("Result: ", result);
})