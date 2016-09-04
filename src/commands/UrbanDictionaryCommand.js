const urban = require("urban");
const config = require("../configuration/Configuration");
const logger = require("../logger/Logger");

module.exports.CommandName = "urban";

module.exports.HandleRequest = function(request, response, next){
  logger.LogInfoData("Received post for command 'urban'", request.params);
  if(request.params.token == config.data.slackToken) {
    if(request.params.text && request.params.text.length > 0) {
      logger.LogInfo(`Looking up definition ${request.params.text}`);
      urban(request.params.text).first(function(json) {
        response.json(200, {
          response_type: "in_channel",
          text: json.definition,
          attachments: [
            {
              text: json.example
            },
            {
              text: json.permalink
            }
          ]
        });
      });
    }
    else {
      logger.LogInfo("Looking up random definition");
      urban.random().first(function(json) {
        response.json(200, {
          response_type: "in_channel",
          text: json.definition,
          attachments: [
            {
              text: json.example
            },
            {
              text: json.permalink
            }
          ]
        });
      });
    }




    // response.json(200, {
    //   response_type: "in_channel",
    //   text: "Slack's POST data: " + JSON.stringify(request.params)
    // });
  }
  return next();
};