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

    // const userMap = users.map((user) => {
    //   user = information.decrypt( user.address )
    //   return user;
    // });

    res.json({
      status: true,
      users: users,
    });
  });
});

app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id, (err, userDb) => {
    if(err){
      return res.status(404).json({
        status: false,
        message: 'Usuario no encontrado'                
      })
    }

    
    if(userDb.name){
      userDb.name = information.decrypt( userDb.name );
      userDb.address = information.decrypt( userDb.address );
      userDb.phone = information.decrypt( userDb.phone );
      userDb.birthDate = information.decrypt( userDb.birthDate );
      userDb.lastName = information.decrypt( userDb.lastName );
      userDb.gender = information.decrypt( userDb.gender );
    }
    

    res.json({
      status: true,
      user: userDb
    })

  })
})


app.post("/user", (req, res) => {
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
});

app.put("/user/:id", (req, res) => {
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
      user: userDb,
    });
  });
});

module.exports = app;
