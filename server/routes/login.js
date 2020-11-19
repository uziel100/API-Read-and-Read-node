const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

const User = require("../models/User");

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, userDb) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: err,
      });
    }

    if (!userDb) {
      return res.status(400).json({
        status: false,
        message: "Usuario o contraseña incorrecto",
      });
    }

    if (!bcrypt.compareSync(password, userDb.password)) {
      return res.status(400).json({
        status: false,
        message: "Usuario o contraseña incorrecto",
      });
    }

    let token = jwt.sign(
      {
        user: userDb,
      },
      process.env.SEED,
      { expiresIn: process.env.EXPIRATION_TOKEN }
    );    

    res.json({
      status: true,
      user:userDb,
      token,
    });
  });
});

module.exports = app;
