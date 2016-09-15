const path = require("path");
const fs = require("fs");
const restify = require("restify");
const logger = require("./logger/Logger");
const config = require("./configuration/Configuration");
const environment = process.env.NODE_ENV || "development";

config.Initialize(path.join(__dirname, "./config.json"));
logger.Initialize(path.join(__dirname, "../logs"), config.data.enableDebugLogs);
logger.LogInfo(`Server is running in '${environment}' environment`)

var server;

if(environment == "production") 
{
  server = restify.createServer({
    //TODO put cert paths in config file
    certificate: fs.readFileSync(config.data.certificatePath),
    key: fs.readFileSync(config.data.keyPath),
    name: "Botanist",
  });

  server.listen(443);
}
else
{
  server = restify.createServer({
    name: "Botanist"
  });

  server.listen(80);
}

logger.LogInfo(`Server name: ${server.name} Server url: ${server.url}`);

//body parser to parse POST requests
server.use(restify.bodyParser({
  mapParams: true,
  overrideParams: false
}));

//serving static files
server.get(/.*/, restify.serveStatic({
  "directory": path.join(__dirname, "../public"),
  "default": "index.html"
 }));

/*
Before submitting a command to your server, Slack will occasionally send your command URLs a simple GET request to verify the certificate. These requests will include a parameter ssl_check set to 1. Mostly, you may ignore these requests, but please do respond with a HTTP 200 OK.
*/
server.get("/command/:name", function(request, response, next){
  response.send(200, "yup!");
  return next();
});

//commands
const UrbanDictionaryCommand = require("./commands/UrbanDictionaryCommand");
const XKCDCommand = require("./commands/XKCDCommand");
const YoutubePreviewCommand = require("./commands/YoutubePreviewCommand.js");

server.post(`/command/${UrbanDictionaryCommand.CommandName}`, UrbanDictionaryCommand.HandleRequest);
server.post(`/command/${XKCDCommand.CommandName}`, XKCDCommand.HandleRequest);
server.post(`/command/${YoutubePreviewCommand.CommandName}`, YoutubePreviewCommand.HandleRequest);