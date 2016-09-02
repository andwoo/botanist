const path = require("path");
const fs = require("fs");
const logger = require("./logger/Logger");
const restify = require("restify");
const environment = process.env.NODE_ENV || "development";

logger.Initialize(path.join(__dirname, "../logs"));
logger.LogInfo(`Server is running in '${environment}' environment`)

var server;

if(environment == "production") 
{
  server = restify.createServer({
    certificate: fs.readFileSync("/etc/letsencrypt/live/anotherone.ca/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/anotherone.ca/privkey.pem"),
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

server.post("/command/:name", function(request, response, next){
  response.json(200, {
    text: "JSON data: " + JSON.stringify(request.params)
  });
  return next();
});