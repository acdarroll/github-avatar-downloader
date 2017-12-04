var request = require('request');
var secrets = require('./secrets');

console.log('Welcome to the Github avatar downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      "User-Agent": `acdarroll:${secrets.GITHUB_URL}`
    }
  }

  request(options, function(err, res, body) {
    var contributors = JSON.parse(body);

    cb(err, contributors);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Error: ", err);

  result.forEach( function(contributor) {
    console.log(contributor['avatar_url']);
  });
})

