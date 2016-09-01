const path = require("path");
const Logger = require("./logger/Logger");

Logger.Initialize(path.join(__dirname, "../logs"));

Logger.LogInfo("WHATS UP");
Logger.LogInfoData("WHATS UP BREH", {p: "oop"});