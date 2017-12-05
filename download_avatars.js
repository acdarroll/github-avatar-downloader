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
    var status = res.statusCode;

    console.log("Response status code:", res.statusCode);
    if(status === 404) {
      return console.log("Provided owner and repo do not exist.");
    } else if (status === 401) {
      return console.log("Authorization is incorrect.")
    }

    cb(err, contributors);
  });
}

// Callback function will download the avatar for each contributor listed in the repo

function rightArguments(argsArray) {
  if(args.length !== 2) {
    console.log("Wrong number of arguments.")
  }
  return args.length === 2;
}

function avatarDir() {
  return fs.existsSync('./avatars/');
}

function checkStateBeforeRunning() {
  // Check if the user input the right number of arguments
  if(!rightArguments(args)) {
    return console.log("Please try again...");
  }

  // Check if the avatar directory exists, throw an error if not
  if (!avatarDir()) {
    return console.log("Cannot find the avatars/ directory");
  }

  // Log to the console if there is an
  try {
  var envString = fs.readFileSync('./.env', 'utf-8')
  } catch (e) {
    return console.log("The .env file is empty");
  }

  // If there is no field matching the GITHUB_TOKEN then
  var matches = envString.match(/GITHUB_TOKEN=(.*)\b/);
  if (!matches) {
    return console.log("Missing a token in the .env file.")
  } else {

  // Call the getRepoContributors function
    getRepoContributors(args[0], args[1], function(err, result) {
      if (err) {
        console.log("callback error:", err);
      }

      result.forEach( function(contributor) {
        downloadImageByURL(contributor['avatar_url'], `./avatars/${contributor['login']}.jpg`);
      });
    });
  }
}

checkStateBeforeRunning();
