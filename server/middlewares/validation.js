const { validationResult } = require("express-validator");

const verifyValidFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Los datos no son validos",
    });
  }else{
    next();
  }
};

module.exports = {
  verifyValidFields,
};
