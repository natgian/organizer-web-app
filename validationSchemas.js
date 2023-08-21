const Joi = require("joi");

module.exports.listSchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string().required()
});

module.exports.itemSchema = Joi.object({
  text: Joi.string().required()
});

module.exports.userSchema = Joi.object({
  username: Joi.string()
  .alphanum()
  .min(2)
  .max(20)
  .required(),
  email: Joi.string()
  .email()
  .required(),
  password: Joi.string()
  .required()
});

