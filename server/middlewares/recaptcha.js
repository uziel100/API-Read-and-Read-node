const axios = require("axios");

const verifyRecaptcha = (req, res, next) => {
  const { tokenCAPTCHA } = req.body;
  if(!tokenCAPTCHA){
    return res.status(400).json({
      status: false,
      message: "Necesitas el token del reCAPTCHA"
    });
  }
  axios
    .post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${"6LdQSkkaAAAAAGaRrKdS_XgfmEy2Gj1E1-U6cnt_"}&response=${tokenCAPTCHA}`
    )
    .then((response) => {
      req.reCaptcha = response.data;
      if(req.reCaptcha.success && req.reCaptcha.score >= 0.5){
        next();
      }else{
        return res.status(400).json({
          status: false,
          message: 'Eres un boot :)'
        })
      }
    })
    .catch((err) => {
      return res.status(500).json({
        status: false,
        message: 'Ha ocurrido un error'
      });
    });
};

module.exports = {
  verifyRecaptcha,
};
