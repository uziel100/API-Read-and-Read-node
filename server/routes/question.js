const express = require("express");
const Question = require("../models/Question");
const User = require("../models/User");
const app = express();

app.get("/question", (req, res) => {
  Question.find((err, data) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Ha ocurrido un error en el servidor",
      });
    }

    res.json({
      status: true,
      data,
    });
  });
});

app.post("/question", (req, res) => {
  const { name } = req.body;

  const newQuestion = new Question({ name });

  newQuestion.save((err, question) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Ha ocurrido un error en el servidor",
      });
    }

    res.json({
      status: true,
      message: "Pregunta registrada :)",
      question,
    });
  });
});

app.get("/question/user/:id", (req, res) => {
  const { id } = req.params;
  User.findOne({ _id: id }, "questionSecret _id").exec((err, user) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Error en el servidor",
      });
    }

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Usuario no encontrado",
      });
    }

    // user exist

    res.json({
      status: true,
      user,
    });
  });
});

module.exports = app;

