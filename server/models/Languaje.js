const mongoose = require("mongoose");

const Schema = mongoose.Schema;

languajeSchema = new Schema(
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

module.exports = mongoose.model("Languaje", languajeSchema);
