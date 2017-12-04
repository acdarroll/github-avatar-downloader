var request = require('request');
var secrets = require('./secrets');
var fs = require("fs");
var config = require("dotenv").config();

var args = process.argv.slice(2);
var token = process.env.GITHUB_TOKEN;

console.log("You're using the Github avatar downloader!");


// filePath is the path to a local directory, url is the user avatar url
function downloadImageByURL(url, filePath) {

  request.get(url)
    .on('error', function(err) {
      throw err;
    })
    .pipe(fs.createWriteStream(filePath))
    .on('finish', function() {
        console.log("Finished downloading image:", filePath);   // Output the filepath when the download is finished
    });
}

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      "User-Agent": "request",
      "Authorization": `token ${token}`
    }
  }

  request(options, function(err, res, body) {
    var contributors = JSON.parse(body);
    console.log("Response status code:", res.statusCode);

    cb(err, contributors);
  });
}

// Callback function will download the avatar for each contributor listed in the repo
if(args.length !== 2) {
    return(console.log)
} else {
  getRepoContributors(args[0], args[1], function(err, result) {
    console.log("Error: ", err);


    result.forEach( function(contributor) {
      downloadImageByURL(contributor['avatar_url'], `./avatars/${contributor['login']}.jpg`);
    });
  });
}


