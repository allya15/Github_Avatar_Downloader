var request = require('request');
var token = require('./secrets').GITHUB_TOKEN;
var fs = require('fs');

var myArgs = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    if (repoOwner === undefined || repoName === undefined) {
      throw new Error("Please enter repoOwner and repoName");
    }

    var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + token
    }
  };

  request(options, function(err, response, body) {
    cb(err, body);
  });
}

function callback(err, result){
  if (err) {
    console.log("Errors:", err);
  }
  var array = JSON.parse(result);
  array.forEach(function (obj) {
    var avatarURL = obj.avatar_url;
    downloadImageByURL(avatarURL, 'avatars/' + obj.login + '.jpg');
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err) {
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(myArgs[0], myArgs[1], callback);

// getRepoContributors("jquery", "jquery", function(err, result) {
//   console.log("Errors:", err);
//   console.log("Result:", result);
// });

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");