const express = require("express");
const bcrypt = require("bcrypt");
const client = require("twilio")(process.env.accountSID, process.env.authToken);
const { verifyValidFields } = require("../middlewares/validation");
const { body } = require("express-validator");
const User = require("../models/User");
const generator = require("generate-password");
const app = express();

const channel = "sms";

app.post(
  "/sms/send",
  body("email").notEmpty().isEmail(),
  verifyValidFields,
  (req, res) => {
    const { email, phoneNumber } = req.body;
    console.log( process.env.serviceID );

    User.findOne({ email }, "_id email signWithGoogle").exec((err, userFounded) => {
      if (err) {
        return res.status(500).json({
          status: false,
          error: "Ha ocurrido un error en el servidor",
        });
      }
      if (!userFounded) {
        return res.status(404).json({
          status: false,
          message:
            "La dirección de correo no parece estar registrado en la plataforma",
        });
      }

    if (userFounded.signWithGoogle) {
    return res.status(400).json({
        status: false,
        message: "Por favor inicia sesión con google",
      });
    }

      // Send message

      client.verify
        .services(process.env.serviceID)
        .verifications.create({
          to: "+" + phoneNumber,
          channel,
        })
        .then((data) => {
          res.json({
            status: true,
            message: "Revisa el codigo que se te envio",
            data,
          });
        })
        .catch((err) => {
          return res.status(400).json({
            status: false,
            message: "Ha ocurrido un error",
            err,
          });
        });
    });
  }
);

app.post("/sms/verify", (req, res) => {
  const { code, phoneNumber, email } = req.body;
  client.verify
    .services(process.env.serviceID)
    .verificationChecks.create({
      to: "+" + phoneNumber,
      code,
    })
    .then( () => {
      // Correct code
      
      User.findOne({ email }, (err, userFounded) => {
        if (err) {
          return res.status(500).json({
            status: false,
            error: "Ha ocurrido un error en el servidor",
          });
        }

        if (!userFounded) {
          return res.status(404).json({
            status: false,
            message: "La dirección de correo no existe",
          });
        }

        // change password
        const password = generator.generate({
            length: 12,
            numbers: true,
        });
      
        const hashPassword = bcrypt.hashSync(password, 10);

        User.findByIdAndUpdate(
          userFounded._id,
          { password: hashPassword },
          { new: true },
          (err) => {
            if (err) {
              return res.status(500).json({
                status: false,
                error: "No se ha podido actualizar la contraseña",
              });
            }

            res.json({
              status: true,
              message: "Contraseña actualizada",
              password,
            });
          }
        );
      });
    })
    .catch((err) => {
      return res.status(400).json({
        status: false,
        message: "Codigo incorrecto",
        err,
      });
    });
});

module.exports = app;
