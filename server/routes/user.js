const express = require("express");
const app = express();

const User = require("../models/User");
const bcrypt = require("bcrypt");
const Encrytion = require("../clases/Encryption");
const information = new Encrytion();

app.get("/user", (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err,
      });
    }

    const userMap = users.map((user) => {
      user.email = information.decrypt(user.email);
      return user;
    });

    res.json({
      status: true,
      users: userMap,
    });
  });
});

app.post("/user", (req, res) => {
  const { email, password } = req.body;
  let emailDuplicated = false;

  User.find({}, "email").exec((err, users) => {
    users.forEach((user) => {
      let emailDecoded = information.decrypt(user.email);
      if (emailDecoded === email) emailDuplicated = true;
    });

    if (!emailDuplicated) {
    // Create new User   
      const newUser = new User({
        email: information.encrypt(email),
        password: bcrypt.hashSync(password, 10),
      });
      
      newUser.save((err, userDb) => {
        if (err) {
          return res.status(400).json({
            status: false,
            message: err,
          });
        }

        res.json({
          status: true,
          message: "Usuario registrado correctamente",
          user: userDb,
        });
      });

    } else {
      return res.status(400).json({
        status: false,
        message: "El email ya ha sido registrado por otro usuario",
      });
    }
  });
});

module.exports = app;
