const urban = require("urban");
const config = require("../configuration/Configuration");
const logger = require("../logger/Logger");

module.exports.CommandName = "urban";

module.exports.HandleRequest = function(request, response, next){
  logger.LogInfoData("Received post for command 'urban'", request.params);
  if(request.params.token == config.data.urbanSlackToken) {
    if(request.params.text && request.params.text.length > 0) {
      logger.LogInfo(`Looking up definition ${request.params.text}`);
      urban(request.params.text).first(function(json) {
        if(json) {
          response.json(200, FormatSlackAttachmentMessage(true, json));
        }
        else {
          response.json(200, FormatSlackMessage(false, `Could not find a definition for ${request.params.text}.`));
        }
      });
    }
    else {
      logger.LogInfo("Looking up random definition");
      urban.random().first(function(json) {
        if(json) {
          response.json(200, FormatSlackAttachmentMessage(true, json));
        }
        else {
          response.json(200, FormatSlackMessage(false, "Could not find a random definition."));
        }
      });
    }
  }
  return next();
};

function FormatSlackAttachmentMessage(sendToChannel, jsonData) {
  return {
    response_type: sendToChannel ? "in_channel" : "ephemeral",
    text: undefined,
    attachments: [{
      title: jsonData.word,
      title_link: jsonData.permalink,
      text: jsonData.definition
    },
    {
      text: `Example:\n ${jsonData.example}`
    }]
  }
}

function FormatSlackMessage(sendToChannel, text) {
  return {
    response_type: sendToChannel ? "in_channel" : "ephemeral",
    text: text
  }
}

//example
// {
// 	definition: 'The ultimate self promoter. He makes good beats but barely says anything in his songs.  He always wants you to listen, but does not have alot to say. Anywhere you see him, either on tv or on a truck or billboard he will be sayin- buy my album.  \r\n \r\n',
// 	permalink: 'http://dj-khaled.urbanup.com/2561463',
// 	thumbs_up: 970,
// 	author: 'Tdowns',
// 	word: 'DJ khaled',
// 	defid: 2561463,
// 	current_vote: '',
// 	example: 'Dj Khaled:  Lisssttennnn\r\nMe: im listening\r\nDj Khaled: We da best!',
// 	thumbs_down: 330
// }