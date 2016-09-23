const config = require("../configuration/Configuration");
const logger = require("../logger/Logger");
const youtube = new (require("youtube-node"))();

youtube.setKey(config.data.youtubeAPIKey);

module.exports.CommandName = "yt";

module.exports.HandleRequest = function(request, response, next){
  logger.LogInfoData("Received post for command 'yt'", request.params);
  if(request.params.token == config.data.youtubeToken) {
    let search = request.params.text;
    if(search && search.length > 0) {
      try {
        let videoId = ExtractVideoIdFromUrl(search);
        if(videoId) {
          youtube.getById(videoId, function(error, jsonData) {
            if(error) {
              response.json(200, FormatSlackMessage(false, error));
            }
            else {
              /*response.json(200, FormatSlackAttachmentMessage(
                true, 
                search, 
                jsonData.items[0].snippet.title,
                jsonData.items[0].snippet.thumbnails.default.url,
                jsonData.items[0].snippet.description));
            }*/
              response.json(200, FormatSlackMessage(true, jsonData.items[0].snippet.description));
          });
        }
        else {
          //search
          SearchAndGetRandomVideo(search, function(error, video) {
            if(error) {
              response.json(200, FormatSlackMessage(false, error));
            }
            else {
              response.json(200, FormatSlackAttachmentMessage(
                true, 
                video.youtubeUrl, 
                video.title,
                video.thumbnail,
                video.description));
            }
          })
        }
      }
      catch(error) {
        response.json(200, FormatSlackMessage(false, error));
      }
    }
    else {
      response.json(200, FormatSlackMessage(false, "You must enter a youtube url or a search."));
    }
  }
  return next();
};

function ExtractVideoIdFromUrl(url) {
  var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match && match[1].length == 11) ? match[1] : null;
}

function SearchAndGetRandomVideo(searchTerm, callback) {
  if(searchTerm && searchTerm.length > 0) {
    youtube.search(searchTerm, 10, function(error, videos) {
      if(error || videos.items.length == 0) {
        callback(error, undefined); 
      }
      else {
        let randomElement = Math.floor(videos.items.length * Math.random());
        let randomVideo = videos.items[randomElement];
        callback(undefined, {
          title: randomVideo.snippet.title,
          youtubeUrl: `https://www.youtube.com/watch?v=${randomVideo.id.videoId}`,
          thumbnail: randomVideo.snippet.thumbnails.default.url,
          description: randomVideo.snippet.description
        });  
      }
    });
  }
  else {
    callback("Search term is empty or null.", undefined);
  }
}

function FormatSlackAttachmentMessage(sendToChannel, youtubeUrl, title, thumbnail, description) {
  return {
    response_type: sendToChannel ? "in_channel" : "ephemeral",
    text: description,
    attachments: [{
      title: title,
      title_link: youtubeUrl,
      image_url: thumbnail
    },
    {
      text: description
    }]
  }
}

function FormatSlackMessage(sendToChannel, text) {
  return {
    response_type: sendToChannel ? "in_channel" : "ephemeral",
    text: text
  }
}
