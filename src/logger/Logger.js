const path = require("path");
const fs = require("fs");
const Winston = require("winston");
const winstonRotateFile = require("winston-daily-rotate-file");

module.exports = class Logger {

  static Initialize(logFilePath, enableDebugLogs) {
    if(!fs.existsSync(logFilePath)) {
      fs.mkdirSync(logFilePath);
    }

    if(enableDebugLogs) {
      Winston.add(winstonRotateFile, {
        filename: path.join(logFilePath, "_info.log"),
        datePattern: "yyyy-MM-dd",
        prepend: true,
        prettyPrint: true,
        level: "info"
      });
    }
    else {
      Winston.add(winstonRotateFile, {
        filename: path.join(logFilePath, "_error.log"),
        datePattern: "yyyy-MM-dd",
        prepend: true,
        prettyPrint: true,
        level: "warn"
      });
      //remove console output in production
      Winston.remove(Winston.transports.Console);
    }

    Winston.handleExceptions(new winstonRotateFile({
      filename: path.join(logFilePath, "_exceptions.log"),
      datePattern: "yyyy-MM-dd",
      prepend: true,
      prettyPrint: true
    }));
  }

  static Log(level, message) {
    Winston.log(level, message);
  }

  static LogData(level, message, data) {
    Winston.log(level, message, data);
  }

  static LogInfo(message) {
    Logger.Log("info", message);
  }

  static LogInfoData(message, data) {
    Logger.LogData("info", message, data);
  }

  static LogWarning(message) {
    Logger.Log("warn", message);
  }

  static LogWarningData(message, data) {
    Logger.LogData("warn", message, data);
  }

  static LogError(message) {
    Logger.Log("error", message);
  }

  static LogErrorData(message, data) {
    Logger.LogData("error", message, data);
  }
}