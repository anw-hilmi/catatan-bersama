import Joi from "joi";

export const noteSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  title: Joi.string().required(),
});

export const authCheckSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
