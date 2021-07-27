const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");
const { transporter } = require("../config/mailer");
const { checkToken, isUser } = require("../middlewares/autentication");
const { OAuth2Client } = require("google-auth-library");
const Encrytion = require("../clases/Encryption");
const information = new Encrytion();
const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require("../models/User");
const Code = require("../models/Code");
const { verifyValidFields } = require("../middlewares/validation");
const { body } = require("express-validator");
const Regex = require("../clases/Validation");
const regex = new Regex();

// logging
const Log = require("../clases/Logging");
const logger = new Log();

app.post(
    "/login",
    body("email").isEmail(),
    body("password").notEmpty(),
    verifyValidFields,
    (req, res) => {
        const { email, password } = req.body;
        let log = {
            description: "Error de inicio de sesión, credenciales no válidas",
            ip: req.ip,
            user: email,
        };

        User.findOne({ email }).exec((err, userDb) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: err,
                });
            }

            if (!userDb) {
                logger.error(log, () => {
                    return res.status(400).json({
                        status: false,
                        message: "Usuario o contraseña incorrecto",
                    });
                });
                return;
            }

            if (!bcrypt.compareSync(password, userDb.password)) {
                logger.error(log, () => {
                    return res.status(400).json({
                        status: false,
                        message: "Usuario o contraseña incorrecto",
                    });
                });
                return;
            }

            // Generate code
            const code = generator.generate({
                length: 10,
                numbers: true,
            });

            // Send msg to email
            transporter.sendMail(
                {
                    from: '"Codigo de verificación 😎" <Uzielmelitonh@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Codigo de verificación (>‿◠)✌", // Subject line

                    html: `
              <p style="margin-bottom: 15px">No compartas este código</p>                      
              <h1>${code}</h1>
            `,
                },
                (err) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: "Ha ocurrido un error al enviar el correo",
                        });
                    }

                    // Save code in database
                    const newCode = new Code({ code });
                    newCode.save((err) => {
                        if (err) {
                            return res.status(500).json({
                                status: false,
                                message: "Ha ocurrido un error en el servidor",
                            });
                        }

                        res.json({
                            status: true,
                            message: "El código ha sido enviado",
                        });
                    });
                }
            );
        });
    }
);

app.post(
    "/movil/login",
    body("email").isEmail(),
    body("password").notEmpty(),
    verifyValidFields,
    (req, res) => {
        const { email, password } = req.body;
        let log = {
            description: "Error de inicio de sesión, credenciales no válidas",
            ip: req.ip,
            user: email,
        };

        User.findOne({ email }).exec((err, userDb) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: err,
                });
            }

            if (!userDb) {
                logger.error(log, () => {
                    return res.status(400).json({
                        status: false,
                        message: "Usuario o contraseña incorrecto",
                    });
                });
                return;
            }

            if (!bcrypt.compareSync(password, userDb.password)) {
                logger.error(log, () => {
                    return res.status(400).json({
                        status: false,
                        message: "Usuario o contraseña incorrecto",
                    });
                });
                return;
            }

            // generate token
            const { _id, email, role, signWithGoogle, name, username } = userDb;
            let token = jwt.sign(
                {
                    user: { _id, email, signWithGoogle },
                },
                process.env.SEED,
                { expiresIn: "7d" }
            );

            
            logger.info(
                {
                    description: "Inicio de sesión como: " + role,
                    ip: req.ip,
                    user: email,
                },
                () => {
                    res.json({
                        status: true,
                        user: {
                            _id,
                            email,
                            name,
                            username                          
                        },
                        token,
                    });
                }
            );
        });
    }
);

app.post(
    "/login/twoFactor",
    body("email").isEmail(),
    body("code").notEmpty(),
    (req, res) => {
        const { email, code } = req.body;
        let log = {
            description: "Error de codigo de acceso",
            ip: req.ip,
            user: email,
        };

        User.findOne({ email }).exec((err, userDb) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: err,
                });
            }

            if (!userDb) {
                return res.status(400).json({
                    status: false,
                    message: "Email inválido",
                });
            }

            Code.findOne({ code }).exec((err, codDb) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: "Ha ocurrido un error en el servidor",
                    });
                }

                if (!codDb) {
                    logger.error(log, () => {
                        return res.status(404).json({
                            status: false,
                            message: "El código no es válido",
                        });
                    });
                    return;
                }

                // Delete code fron database

                Code.findByIdAndRemove(codDb._id, (err) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: "Ha ocurrido un error en el servidor",
                        });
                    }

                    // generate token
                    let token = jwt.sign(
                        {
                            user: userDb,
                        },
                        process.env.SEED,
                        { expiresIn: process.env.EXPIRATION_TOKEN }
                    );

                    const { _id, email, photo, name, lastName, role, username } = userDb;
                    logger.info(
                        {
                            description: "Inicio de sesión como: " + role,
                            ip: req.ip,
                            user: email,
                        },
                        () => {
                            res.json({
                                status: true,
                                user: {
                                    _id,
                                    email,
                                    photo,
                                    name,
                                    lastName,
                                    role,
                                    username
                                },
                                token,
                            });
                        }
                    );
                });
            });
        });
    }
);

// SETTING GOOGLE

async function verify(token, movil = false) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: movil? process.env.CLIENT_ID_MOVIL : process.env.CLIENT_ID,
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

    User.findOne(
        { email: googleUser.email },
        "email name photo role signWithGoogle _id username"
    ).exec((err, userDb) => {
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
                        user: userDb,
                    },
                    process.env.SEED,
                    { expiresIn: process.env.EXPIRATION_TOKEN }
                );
                logger.info(
                    {
                        description:
                            "Inicio de sesión con google como: " + userDb.role,
                        ip: req.ip,
                        user: userDb.email,
                    },
                    () => {
                        return res.json({
                            status: true,
                            user: userDb,
                            token,
                        });
                    }
                );
                return;
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
                        user: userDb,
                    },
                    process.env.SEED,
                    { expiresIn: process.env.EXPIRATION_TOKEN }
                );
                logger.info(
                    {
                        description: "Registro de usuario con google",
                        ip: req.ip,
                        user: userDb.email,
                    },
                    () => {
                        res.json({
                            status: true,
                            user: userDb,
                            token,
                        });
                    }
                );
            });
        }
    });
});

app.post("/movil/google", async (req, res) => {
    let token = req.body.idtoken;    
    let googleUser = await verify(token, true).catch((e) => {
        return res.status(403).json({
            status: false,
            message: "Ha ocurrido un error con la autenticacioón con google",
        });
    });

    User.findOne(
        { email: googleUser.email },
        "email signWithGoogle _id role username photo"
    ).exec((err, userDb) => {
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
                    message: "Use la autenticación normal",
                });
            } else {
                let token = jwt.sign(
                    {
                        user: userDb,
                    },
                    process.env.SEED,
                    { expiresIn: process.env.EXPIRATION_TOKEN }
                );
                logger.info(
                    {
                        description:
                            "Inicio de sesión con google como: " + userDb.role,
                        ip: req.ip,
                        user: userDb.email,
                    },
                    () => {
                        return res.json({
                            status: true,
                            user: userDb,
                            token,
                        });
                    }
                );
                return;
            }
        }         
    });
});

app.post(
    "/register",
    body("email").isEmail(),
    body("password").matches(regex.isStrongPassword()),
    body("username").trim().matches(regex.isUserName()),
    verifyValidFields,
    (req, res) => {
        const { email, password, username } = req.body;

        // Create new User
        const newUser = new User({
            email,
            password: bcrypt.hashSync(password, 10),
            username
        });

        newUser.save((err, userDb) => {
            if (err) {         
                return res.status(500).json({
                    status: false,
                    message: err.errors                    
                });
            }

            logger.info(
                {
                    description: "Registro de usuario",
                    ip: req.ip,
                    user: email,
                },
                () => {
                    res.json({
                        status: true,
                        message: "Usuario registrado correctamente",
                    });
                }
            );
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

                //create token

                const token = jwt.sign(
                    { user: userFounded },
                    process.env.SEED,
                    {
                        expiresIn: "10m",
                    }
                );
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
                                message:
                                    "Ha ocurrido un error al enviar el correo",
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

                logger.info(
                    {
                        description: "Restauración de contraseña normal",
                        ip: req.ip,
                        user: email,
                    },
                    () => {
                        res.json({
                            status: true,
                            message: "Contraseña actualizada",
                        });
                    }
                );
            }
        );
    });
});

app.put("/changepassword/:id", [checkToken, isUser], (req, res) => {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;

    User.findById(id, (err, userFind) => {
        if (err) {
            return res.status(500).json({
                status: false,
                error: "Ha ocurrido un error en el servidor",
            });
        }

        if (!userFind) {
            return res.status(404).json({
                status: false,
                message: "El usuario no existe",
            });
        }

        if (!bcrypt.compareSync(oldPassword, userFind.password)) {
            logger.warn(
                {
                    description: "Contraseña actual no válida",
                    ip: req.ip,
                    user: userFind.email,
                },
                () => {
                    return res.status(400).json({
                        status: false,
                        message: "La contraseña anterior es incorrecta",
                    });
                }
            );
            return;
        } else {
            const hashPassword = bcrypt.hashSync(newPassword, 10);
            User.findByIdAndUpdate(
                id,
                { password: hashPassword },
                (err, userDb) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: err,
                        });
                    }

                    logger.info(
                        {
                            description: "Actualización de contraseña",
                            ip: req.ip,
                            user: userDb.email,
                        },
                        () => {
                            res.send({
                                status: true,
                                message: "Contraseña actualizada",
                            });
                        }
                    );
                }
            );
        }
    });
});

app.post("/restorePasswordWithQuestionSecret", (req, res) => {
    const { email, question, answer } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Error en el servidor",
            });
        }

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "El email no esta registrado en la plataforma",
            });
        }

        if (user.signWithGoogle) {
            return res.status(400).json({
                status: false,
                message: "Por favor inicia sesión con google",
            });
        }

        // user exist

        if (!(user["questionSecret"] && user.questionSecret["question"])) {
            return res.status(400).json({
                status: false,
                message: "No has registrado una pregunta, utiliza otro método",
            });
        }

        // there's question
        // verify if correct question

        if (
            user.questionSecret.question.toString() === question &&
            user.questionSecret.answer === answer
        ) {
            // Generate code
            const password = generator.generate({
                length: 10,
                numbers: true,
            });

            const hashPassword = bcrypt.hashSync(password, 10);
            User.findByIdAndUpdate(
                user._id,
                { password: hashPassword },
                (err) => {
                    if (err) {
                        return res.status(500).json({
                            status: false,
                            message: "Error en el servidor",
                        });
                    }

                    logger.info(
                        {
                            description:
                                "Restauración de contraseña por pregunta secreta",
                            ip: req.ip,
                            user: email,
                        },
                        () => {
                            res.json({
                                status: true,
                                message: "Contraseña restablecida :)",
                                password,
                            });
                        }
                    );
                }
            );
        } else {
            return res.status(400).json({
                status: false,
                message: "Respuestas icorrectas",
            });
        }
    });
});

module.exports = app;
