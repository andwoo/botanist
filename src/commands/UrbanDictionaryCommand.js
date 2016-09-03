const urban = require("urban");
const config = require("../configuration/Configuration");

module.exports.CommandName = "urban";

module.exports.HandleRequest = function(request, response, next){
  //TODO put token in config file
  if(request.params.token == config.data.slackToken) {
    response.json(200, {
      response_type: "in_channel",
      text: "Slack's POST data: " + JSON.stringify(request.params)
    });
  }
  return next();
};