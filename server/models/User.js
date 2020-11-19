const mongoose = require("mongoose");
const unique = require("mongoose-unique-validator");
const Enviroment = require("../config/enviroment");

let Schema = mongoose.Schema;
const rolesValids = {
  values: Enviroment.roles,
  message: "{VALUE} no es un rol valido",
};

let userSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El email es obligatorio"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatorio"],
  },
  img: {
    type: String,
    required: false,
  },
  state: {
    type: Boolean,
    default: true,
  },
  address: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  birthDate: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValids,
  },
  signWithGoogle: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

userSchema.plugin(unique, { message: "{PATH} debe ser unico" });
module.exports = mongoose.model("User", userSchema);
