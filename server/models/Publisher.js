const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const publisherSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Publisher", publisherSchema);
