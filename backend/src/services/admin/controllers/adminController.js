import { updateCredentialSchema } from "../validator/schema.js";
import {
  getAllCredentials,
  updateCredential,
} from "../repositories/adminRepository.js";
import InvariantError from "../../../exceptions/invariantError.js";
import NotFoundError from "../../../exceptions/notFoundError.js";
import sendSuccessResponse from "../../../utils/response.js";

export const getAllCredentialsHandler = async (req, res, next) => {
  try {
    const credentials = await getAllCredentials();
    return sendSuccessResponse(
      res,
      credentials,
      "Berhasil mengambil semua kredensial",
    );
  } catch (err) {
    next(err);
  }
};

export const updateCredentialHandler = async (req, res, next) => {
  try {
    const { error, value } = updateCredentialSchema.validate(req.body);
    if (error) throw new InvariantError(error.message);

    const { tableName, id, username, password } = value;

    const updated = await updateCredential(tableName, id, username, password);

    if (!updated) throw new NotFoundError("Data tidak ditemukan");

    return sendSuccessResponse(res, updated, "Kredensial berhasil diperbarui");
  } catch (err) {
    next(err);
  }
};
