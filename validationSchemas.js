const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!"
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error("string.escapeHTML", {value})
        return clean;
      }
    }
  }
});

const Joi = BaseJoi.extend(extension);

module.exports.listSchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
  color: Joi.string().required()
});

module.exports.itemSchema = Joi.object({
  text: Joi.string().required().escapeHTML()
});

module.exports.userSchema = Joi.object({
  username: Joi.string()
  .alphanum()
  .min(2)
  .max(20)
  .required()
  .escapeHTML(),
  email: Joi.string()
  .email()
  .required()
  .escapeHTML(),
  password: Joi.string()
  .required()
  .escapeHTML()
});

module.exports.noteSchema = Joi.object({
  title: Joi.string().required().escapeHTML(),
  body: Joi.string().required().escapeHTML()
});

module.exports.budgetSchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
  color: Joi.string(),
  budget: Joi.number().required()
});

module.exports.expenseSchema = Joi.object({
  date: Joi.date().required(),
  description: Joi.string().required().escapeHTML(),
  expense: Joi.number().required()
});

module.exports.calendarSchema = Joi.object({
  date: Joi.date().required(),
  title: Joi.string().required().escapeHTML(),
  color: Joi.string().required(),
  startEventTime: Joi.string().allow(""),
  endEventTime: Joi.string().allow("")
});



