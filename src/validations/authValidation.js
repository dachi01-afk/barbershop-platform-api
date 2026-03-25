const Joi = require("joi");

// REGISTER
const registerValidation = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required(),
  password: Joi.string().min(6).required(),
});

// LOGIN
const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// FORGOT PASSWORDmodule.exports = validationMiddleware;
const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
});

// RESET PASSWORD
const resetPasswordValidation = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};