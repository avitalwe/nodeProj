const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");



const userSchema = new mongoose.Schema({
  firstName: String,
  lastName:String,
  email: String,
  password: String,
  date_created: {
    type: Date, default: Date.now()
  },

  role: {
    type: String, default: "user"
  }
})

exports.User = mongoose.model("User", userSchema);

exports.createToken = (_id, _role) => {
  let token = jwt.sign({ _id, _role }, config.tokenSecret, { expiresIn: "90mins" });
  return token;
}

exports.validUser = (_reqBody) => {
  let joiSchema = Joi.object({
   
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required(),
   
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(3).max(99).required(),
    date_created: Joi.date(),
    role:Joi.string()
  })
  return joiSchema.validate(_reqBody);
}

exports.validLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(3).max(99).required()
  })
  return joiSchema.validate(_reqBody);
}