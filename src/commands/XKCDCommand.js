const http = require("http");
const xmlParser = new require("xml2js").Parser();
const config = require("../configuration/Configuration");
const logger = require("../logger/Logger");

//Regex
var imageRegex = /<img src="(.*?)"/i;
var hoverRegex = /title="(.*?)"/i;

module.exports.CommandName = "xkcd";

module.exports.HandleRequest = function(request, response, next){
  logger.LogInfoData("Received post for command 'urban'", request.params);
  if(request.params.token == config.data.xkcdSlackToken) {
    GetXKCDRss(function(error, comic) {
      if(error) {
        response.json(200, FormatSlackMessage(false, error));
      }
      else {
        response.json(200, FormatSlackAttachmentMessage(true, comic));
      }
    });
  }
  return next();
};

function GetXKCDRss(callback) {
  //get the latest xkcd comic
  http.get({
    host: "xkcd.com",
    path: "/rss.xml"
  }, function(response) {
    let data = "";

    response.on("data", function(chunk){
      data += chunk;
    });

    response.on("end", function(){
      let obj = xmlParser.parseString(data, function(error, parsed) {
        if(error) {
          callback(error, undefined);
        }
        else {
          try {
            let latestComic = parsed.rss.channel[0].item[0];
            callback(undefined, {
              title: latestComic.title[0],
              hoverTitle: hoverRegex.exec(latestComic.description[0])[1],
              link: latestComic.link[0],
              image: imageRegex.exec(latestComic.description[0])[1]
            });
          }
          catch(error) {
            callback(error, undefined);
          }
        }
      });
    });

    response.on("error", function(error) {
      callback(error, undefined);
    });
  });
}

function FormatSlackAttachmentMessage(sendToChannel, jsonData) {
  return {
    response_type: sendToChannel ? "in_channel" : "ephemeral",
    text: undefined,
    attachments: [{
      title: jsonData.title,
      title_link: jsonData.link,
      text: jsonData.image
    },
    {
      text: jsonData.hoverTitle
    }]
  }
}

function FormatSlackMessage(sendToChannel, text) {
  return {
    response_type: sendToChannel ? "in_channel" : "ephemeral",
    text: text
  }
}

/*
{ title: 'Wrong',
  hoverTitle: 'Hang on, I just remembered another thing I\'m right about. See...',
  link: 'http://xkcd.com/1731/',
  image: 'http://imgs.xkcd.com/comics/wrong.png' }
*/