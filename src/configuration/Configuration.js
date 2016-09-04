const fs = require("fs");
const jsonmake = require("jsonmake");

var configObject = {
  certificatePath: "",
  keyPath: "",
  slackToken: "",
  enableDebugLogs: true
}

module.exports.Initialize = function(configPath) {
  jsonmake.make(configObject, fs.readFileSync(configPath, "utf-8"));
}

module.exports.data = configObject;