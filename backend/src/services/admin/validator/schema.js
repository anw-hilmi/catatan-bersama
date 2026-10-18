import Joi from "joi";

export const updateCredentialSchema = Joi.object({
  tableName: Joi.string()
    .valid("peraturan", "tugas_utama", "tugas_harian", "acara", "doa", "admin")
    .required(),
  id: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});
