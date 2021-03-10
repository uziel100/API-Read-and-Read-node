const express = require("express");
const app = express();

const Feedback = require("../models/Feedback.js");
const { isAdmin } = require("../middlewares/autentication");
const { verifyRecaptcha } = require("../middlewares/recaptcha");
const { verifyValidFields } = require("../middlewares/validation");
const { body } = require("express-validator");
const Regex = require("../clases/Validation");
const regex = new Regex();

app.get("/feedback", isAdmin, (req, res) => {
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

app.post(
  "/feedback",
  [
  verifyRecaptcha,
    body("name").matches(regex.isOnlyLetters()).trim(),
    body("email").isEmail().trim(),
    body("phone").isLength({ min: 10, max: 10 }).isNumeric().trim(),
    body("comment").matches( regex.isOnlyText() ).trim(),
    verifyValidFields
  ],
  (req, res) => {
    const { name, email, phone, comment } = req.body;

    let newFeedback = new Feedback({ name, email, phone, comment });

    newFeedback.save( err => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Error en la conexion con el servidor",
        });
      }

      res.json({
        status: true,
        message: "Envío exitoso",        
      });
    });
  }
);

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
