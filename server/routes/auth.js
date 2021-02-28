const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter } = require("../config/mailer");
const { checkToken } = require("../middlewares/autentication");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const Encrytion = require("../clases/Encryption");
const information = new Encrytion();
const app = express();

const User = require("../models/User");
const { verifyValidFields } = require("../middlewares/validation");
const { body } = require("express-validator");
const Regex = require("../clases/Validation");
const regex = new Regex();

app.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  verifyValidFields,
  (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }, "email _id role name password photo").exec(
      (err, userDb) => {
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
      }
    );
  }
);

// SETTING GOOGLE

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    photo: payload.picture,
    google: true,
  };
}

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token).catch((e) => {
    return res.status(403).json({
      status: false,
      message: "Ha ocurrido un error con la autenticacioón con google",
    });
  });

  User.findOne({ email: googleUser.email }, (err, userDb) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Ha ocurrido un error en el servidor",
      });
    }

    if (userDb) {
      if (userDb.signWithGoogle === false) {
        return res.status(400).json({
          status: false,
          message: "Email registrado, use la autenticación normal",
        });
      } else {
        let token = jwt.sign(
          {
            usuario: userDb,
          },
          process.env.SEED,
          { expiresIn: process.env.EXPIRATION_TOKEN }
        );

        return res.json({
          status: true,
          user: userDb,
          token,
        });
      }
    } else {
      // si el usuario no existe en la base de datos

      let newUser = new User();

      newUser.name = information.encrypt(googleUser.name);
      newUser.email = googleUser.email;
      newUser.photo = googleUser.photo;
      newUser.signWithGoogle = true;
      newUser.password = ":)";

      newUser.save((err, userDb) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: err,
          });
        }

        let token = jwt.sign(
          {
            usuario: userDb,
          },
          process.env.SEED,
          { expiresIn: process.env.EXPIRATION_TOKEN }
        );

        return res.json({
          status: true,
          user: userDb,
          token,
        });
      });
    }
  });
});

app.post(
  "/register",
  body("email").isEmail(),
  body("password").matches(regex.isStrongPassword()),
  verifyValidFields,
  (req, res) => {
    const { email, password } = req.body;

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
  }
);

app.post(
  "/forgotPassword",
  body("email").notEmpty().isEmail(),
  verifyValidFields,
  (req, res) => {
    const { email } = req.body;

    User.findOne({ email }, "_id email signWithGoogle").exec(
      (err, userFounded) => {
        if (err) {
          return res.status(500).json({
            status: false,
            error: 'Ha ocurrido un error en el servidor',
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

        //create token

        const token = jwt.sign({ user: userFounded }, process.env.SEED, {
          expiresIn: "10m",
        });
        const redirectLink = process.env.URL_SITE + `?t=${token}`;

        transporter.sendMail(
          {
            from: '"Olvidaste tu contraseña 👻" <Uzielmelitonh@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Ovidaste tu contraseña ✔", // Subject line

            html: `
          <p style="margin-bottom: 15px">Por favor da clic en el boton para seguir con el proceso</p>
            <a href="${redirectLink}">
            <button style="background: #2F80ED; border-radius: 6px; color: #fff; padding: 5px 20px">Restablecer contraseña</button>
          </a>
          `,
          },
          (err) => {
            if (err) {
              return res.status(500).json({
                status: false,
                message: "Ha ocurrido un error al enviar el correo",
              });
            }

            res.json({
              status: true,
              message: "Email enviado",
            });
          }
        );
      }
    );
  }
);

app.post("/restorePassword", checkToken, (req, res) => {
  const { _id: userId } = req.user;
  const { email, password } = req.body;

  const hashPassword = bcrypt.hashSync(password, 10);

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

    User.findByIdAndUpdate(
      userId,
      { password: hashPassword },
      { new: true },
      (err, user) => {
        if (err) {
          return res.status(500).json({
            status: false,
            error: "No se ha podido actualizar la contraseña",
          });
        }

        res.json({
          status: true,
          message: "Contraseña actualizada",
        });
      }
    );
  });
});

module.exports = app;
