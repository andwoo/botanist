const config = require("../configuration/Configuration");
const logger = require("../logger/Logger");
const youtube = new (require("youtube-node"))();

youtube.setKey(config.data.youtubeAPIKey);

module.exports.CommandName = "yt";

module.exports.HandleRequest = function(request, response, next){
  logger.LogInfoData("Received post for command 'yt'", request.params);
  if(request.params.token == config.data.youtubeToken) {
    let youtubeUrl = request.params.text;
    if(youtubeUrl && youtubeUrl.length > 0) {
      try {
        youtube.getById(ExtractVideoIdFromUrl(request.params.text), function(error, jsonData) {
          if(error) {
            response.json(200, FormatSlackMessage(false, error));
          }
          else {
            response.json(200, FormatSlackAttachmentMessage(true, youtubeUrl, jsonData));
          }
        });
      }
      catch(error) {
        response.json(200, FormatSlackMessage(false, error));
      }
    }
    else {
      response.json(200, FormatSlackMessage(false, "You must enter a youtube url."));
    }
  }
  return next();
};

function ExtractVideoIdFromUrl(url) {
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[1].length == 11) ? match[1] : "";
  }

function FormatSlackAttachmentMessage(sendToChannel, youtubeUrl, jsonData) {
  return {
    response_type: sendToChannel ? "in_channel" : "ephemeral",
    text: youtubeUrl,
    attachments: [{
      title: jsonData.items[0].snippet.title,
      title_link: youtubeUrl,
      image_url: jsonData.items[0].snippet.thumbnails.default.url
    },
    {
      text: jsonData.items[0].snippet.description
    }]
  }
}

function FormatSlackMessage(sendToChannel, text) {
  return {
    response_type: sendToChannel ? "in_channel" : "ephemeral",
    text: text
  }
}