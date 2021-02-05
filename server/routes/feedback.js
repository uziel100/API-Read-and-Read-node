const express = require("express");
const app = express();

const Feedback = require("../models/Feedback.js");
const { verifyRecaptcha } = require("../middlewares/recaptcha");

app.get("/feedback", (req, res) => {
  Feedback.find((err, comments) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Ha ocurrido un error",
      });
    }
    res.json({
      status: true,
      comments,
    });
  });
});

app.post("/feedback", verifyRecaptcha, (req, res) => {
  const { name, email, phone, comment } = req.body;

  let newFeedback = new Feedback({ name, email, phone, comment });

  newFeedback.save((err, feedback) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Error en la conexion con el servidor",
      });
    }

    res.json({
      status: true,
      message: "Envío exitoso",
      feedback,
    });
  });
});

// TEST FOR reCAPTCHA 
app.post("/recaptcha", verifyRecaptcha, (req, res) => {
  const reCaptcha = req.reCaptcha;

  console.log(reCaptcha);

  res.json({
    status: true,
    message: "No eres un robot",
  });
});

module.exports = app;
