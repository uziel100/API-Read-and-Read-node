const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: "uzielmelitonh@gmail.com", 
      pass: "rdwlurzfwvvdandf", 
    },
  });


  module.exports = { 
      transporter
  }