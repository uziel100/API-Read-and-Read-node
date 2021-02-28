const express = require("express");
const app = express();

const User = require("../models/User");
const Encrytion = require("../clases/Encryption");
const information = new Encrytion();
const { checkToken } = require("../middlewares/autentication");
const { verifyValidFields } = require("../middlewares/validation");
const { body, param } = require("express-validator");
const Regex = require("../clases/Validation");
const regex = new Regex();

app.get("/user", (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err,
      });
    }

    res.json({
      status: true,
      users: users,
    });
  });
});

app.get(
  "/user/:id",
  checkToken,
  param("id").matches(regex.isValidObjectId()),
  verifyValidFields,
  (req, res) => {
    const id = req.params.id;
    
    User.findById(id, (err, userDb) => {
      if (err) {
        return res.status(404).json({
          status: false,
          message: "Usuario no encontrado",
        });
      }

      userDb.name = userDb.name ? information.decrypt(userDb.name) : "";
      userDb.address = userDb.address
        ? information.decrypt(userDb.address)
        : "";
      userDb.phone = userDb.phone ? information.decrypt(userDb.phone) : "";
      userDb.birthDate = userDb.birthDate
        ? information.decrypt(userDb.birthDate)
        : "";
      userDb.lastName = userDb.lastName
        ? information.decrypt(userDb.lastName)
        : "";
      userDb.gender = userDb.gender ? information.decrypt(userDb.gender) : "";

      res.json({
        status: true,
        user: userDb,
      });
    });
  }
);

app.put(
  "/user/:id",
  body("name").trim().matches(regex.isOnlyLetters()),
  body("lastName").trim().matches(regex.isOnlyLetters()),
  body("address").trim().matches(regex.isOnlyText()),
  body("phone").trim().isLength({ min: 10, max: 10 }).isNumeric(),
  body("birthDate").matches(regex.isDate()),
  body("gender").isIn(["Masculino", "Femenino"]),
  verifyValidFields,
  (req, res) => {
    const id = req.params.id;
    const { name, lastName, address, phone, birthDate, gender } = req.body;

    const dataEconded = {
      name: information.encrypt(name),
      lastName: information.encrypt(lastName),
      address: information.encrypt(address),
      phone: information.encrypt(phone),
      birthDate: information.encrypt(birthDate),
      gender: information.encrypt(gender),
    };

    User.findByIdAndUpdate(id, dataEconded, (err, userDb) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: err,
        });
      }

      res.send({
        status: true,
        message: "Datos actualizados",
      });
    });
  }
);

module.exports = app;
