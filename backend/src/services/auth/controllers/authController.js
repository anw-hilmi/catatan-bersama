import bcrypt from "bcrypt";
import { loginSchema } from "../validator/schema.js";
import { findAdminByUsername } from "../repositories/authRepository.js";
import tokenManager from "../../../security/tokenManager.js";
import AuthenticationError from "../../../exceptions/authenticationError.js";
import InvariantError from "../../../exceptions/invariantError.js";
import sendSuccessResponse from "../../../utils/response.js";

export const loginHandler = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) throw new InvariantError(error.message);

    const { username, password } = value;
    const admin = await findAdminByUsername(username);

    if (!admin) {
      throw new AuthenticationError("Username Salah");
    }

    if (password !== admin.password) {
      throw new AuthenticationError("Password Salah");
    }

    const token = tokenManager.generateToken({
      id: admin.id,
      username: admin.username,
    });
    return sendSuccessResponse(res, { token }, "Login berhasil");
  } catch (err) {
    next(err);
  }
};
