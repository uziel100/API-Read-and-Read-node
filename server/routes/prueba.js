const express = require("express");
const app = express();

const Encrytion = require("../clases/Encryption");
const information = new Encrytion();

app.get("/test", (req, res) => {
  const { name, lastname, email } = req.body;
  const infoEncrypt = {
      name: information.encrypt(name),
      lastname: information.encrypt(lastname),
      email: information.encrypt(email)
  }
  
  res.json( infoEncrypt );
});

app.get("/hash", (req, res) => {  
  const data = information.decrypt("9d7d4d0328c035e8469ec24b44b56964b4d587f4b75e6e725fd58d519433eaff1d665d6291d9ffffba971ea5bdaa7a69a11861c9a1505a060796cd8e27dadbb02b6209efd00bb9778c94439c78751386012ef79d0a57abea8556b9862f234b5fe0b8190e1bf0b89ea26a13b2bc4f921dfddc3417987b8150af0f83c9c8");
  res.json(data);
});

module.exports = app;
