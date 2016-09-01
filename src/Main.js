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
    certificate: fs.readFileSync("/etc/letsencrypt/live/anotherone.ca/cert.pem"),
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