const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

const User = require("../models/User");

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, 'email _id role name password photo').exec( (err, userDb) => {
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
    
    const { _id, email, photo, name, lastName } = userDb;

    res.json({
      status: true,
      user: { _id, email, photo, name, lastName },
      token,
    });
  });
});

app.post("/register", (req, res) => {
  const { email, password  } = req.body;

  // Create new User
  const newUser = new User({
    email,
    password: bcrypt.hashSync(password, 10),
  });

  newUser.save((err, userDb) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "El email ya ha sido registrado por otro usuario",
      });
    }

    res.json({
      status: true,
      message: "Usuario registrado correctamente",
      user: userDb,
    });
  });
});



module.exports = app;
