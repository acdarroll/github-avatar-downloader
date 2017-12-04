var request = require('request');
var secrets = require('./secrets');
var fs = require("fs");

var args = process.argv.slice(2);

console.log("You're using the Github avatar downloader!");

function downloadImageByURL(url, filePath) {

  request.get(url + '/' + filePath)
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response) {
      console.log("Downloading image:", filePath);
    })
    .pipe(fs.createWriteStream("./avatars/" + filePath))
    .on('finish', function() {
        console.log("Download complete.")
    });
}

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

getRepoContributors(args[0], args[1], function(err, result) {
  console.log("Error: ", err);

  result.forEach( function(contributor) {
    downloadImageByURL(contributor['avatar_url'] + "avatars/", contributor['login'] + ".jpg");
  });
})

