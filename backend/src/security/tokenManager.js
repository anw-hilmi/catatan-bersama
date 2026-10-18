import jwt from "jsonwebtoken";
import InvariantError from "../exceptions/invariantError.js";

const tokenManager = {
  generateToken: (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }),
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new InvariantError("Token tidak valid");
    }
  },
};

export default tokenManager;
