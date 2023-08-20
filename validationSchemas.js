const Joi = require("joi");

module.exports.listSchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string().required()
});

