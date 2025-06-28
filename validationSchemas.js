const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} darf kein HTML enthalten!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
          textFilter: (text) => {
            return text.replace(/&amp;/g, "&").replace(/&eacute;/g, "é");
          },
        });
        if (clean !== value) return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

const listSchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
  color: Joi.string().required(),
});

const projectSchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
  description: Joi.string().escapeHTML().allow(""),
  color: Joi.string().required(),
});

const itemSchema = Joi.object({
  text: Joi.string().required().escapeHTML(),
});

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(20).required().escapeHTML(),
  email: Joi.string().email().required().escapeHTML(),
  password: Joi.string().required().escapeHTML(),
  "cf-turnstile-response": Joi.string().required(),
});

const userEmailSchema = Joi.object({
  email: Joi.string().email().required().escapeHTML(),
});

const noteSchema = Joi.object({
  title: Joi.string().required().escapeHTML(),
  body: Joi.string().required().escapeHTML(),
});

const transactionSchema = Joi.object({
  transactionDate: Joi.date().required(),
  transactionDescription: Joi.string().required().escapeHTML(),
  transactionAmount: Joi.number().required(),
  transactionType: Joi.string().required(),
});

const budgetSchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
  color: Joi.string(),
  budget: Joi.number().required(),
  remainingBudget: Joi.number(),
  transactions: Joi.array().items(transactionSchema),
});

const calendarSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  title: Joi.string().required().escapeHTML(),
  color: Joi.string().required(),
  startEventTime: Joi.string().allow(""),
  endEventTime: Joi.string().allow(""),
  reccurence: Joi.when("yearly", {
    is: true,
    then: Joi.string().valid("yearly").required(),
    otherwise: Joi.string().optional(),
  }),
});

const todoSchema = Joi.object({
  text: Joi.string().required().escapeHTML(),
});

const projectBudgetSchema = Joi.object({
  projectBudget: Joi.number().required(),
});

const projectBudgetTransactionSchema = Joi.object({
  projectTransactionDate: Joi.date().required(),
  projectTransactionDescription: Joi.string().required().escapeHTML(),
  projectTransactionAmount: Joi.number().required(),
  projectTransactionType: Joi.string().required(),
});

module.exports = {
  listSchema,
  projectSchema,
  itemSchema,
  userSchema,
  userEmailSchema,
  noteSchema,
  transactionSchema,
  budgetSchema,
  calendarSchema,
  todoSchema,
  projectBudgetSchema,
  projectBudgetTransactionSchema,
};
