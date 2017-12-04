var request = require('request');
var secrets = require('./secrets');
var fs = require("fs");

console.log('Welcome to the Github avatar downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      "User-Agent": "acdarroll",
      "Authorization": "token " + secrets.GITHUB_TOKEN
    }
  }

  request(options, function(err, res, body) {
    var contributors = JSON.parse(body);
    console.log(res.headers);
    console.log(contributors);

    cb(err, contributors);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Error: ", err);

  result.forEach( function(contributor) {
    console.log(contributor['avatar_url']);
  });
})

function downloadImageByURL(url, filePath) {

  request.get(url + '/' + filePath)
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response) {
      console.log("Content type:", response.headers['content-type']);
      console.log("Downloading image...");
    })
    .pipe(fs.createWriteStream('./avatar.jpg'))
    .on('finish', function() {
        console.log("Download complete.")
    });
}

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");

