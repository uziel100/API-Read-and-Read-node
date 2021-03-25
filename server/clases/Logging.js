module.exports = class Logging {
  constructor() {
    this.Logging = require("../models/Logging");
  }
  error({ description, ip, user }, callback) {
    const log = {
      type: "ERROR",
      description,
      ip,
      user,
    };

    const newLogging = new this.Logging(log);
    newLogging.save((err) => {
      if (err) {
        return callback(false);
      }

      callback(true);
    });
  }
  info({ description, ip, user }, callback) {
    const log = {
      type: "INFO",
      description,
      ip,
      user,
    };

    const newLogging = new this.Logging(log);
    newLogging.save((err) => {
      if (err) {
        return callback(false);
      }

      callback(true);
    });
  }

  warn({ description, ip, user }, callback) {
    const log = {
      type: "WARN",
      description,
      ip,
      user,
    };

    const newLogging = new this.Logging(log);
    newLogging.save((err) => {
      if (err) {
        return callback(false);
      }

      callback(true);
    });
  }
};
