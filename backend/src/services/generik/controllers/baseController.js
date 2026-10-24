import { nanoid } from "nanoid";
import { noteSchema, authCheckSchema } from "../validator/schema.js";
import InvariantError from "../../../exceptions/invariantError.js";
import NotFoundError from "../../../exceptions/notFoundError.js";
import AuthenticationError from "../../../exceptions/authenticationError.js";
import sendSuccessResponse from "../../../utils/response.js";

const verifyOwner = (note, username, password) => {
  if (note.username !== username || note.password !== password) {
    throw new AuthenticationError("Username atau password salah");
  }
};

export const createController = (repo) => ({
  getAllHandler: async (req, res, next) => {
    try {
      const { search } = req.query;
      const data = await repo.getAll(search || "");
      return sendSuccessResponse(res, data);
    } catch (err) {
      next(err);
    }
  },

  createHandler: async (req, res, next) => {
    try {
      const { error, value } = noteSchema.validate(req.body);
      if (error) throw new InvariantError(error.message);

      const id = nanoid(16);
      const data = await repo.create({ id, ...value });

      return sendSuccessResponse(res, data, "Catatan berhasil dibuat", 201);
    } catch (err) {
      next(err);
    }
  },

  updateHandler: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { error, value } = noteSchema.validate(req.body);
      if (error) throw new InvariantError(error.message);

      const existingNote = await repo.getById(id);
      if (!existingNote) throw new NotFoundError("Catatan tidak ditemukan");

      verifyOwner(existingNote, value.username, value.password);
      const updated = await repo.update(id, value);

      return sendSuccessResponse(res, updated, "Catatan berhasil diperbarui");
    } catch (err) {
      next(err);
    }
  },

  deleteHandler: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { error, value } = authCheckSchema.validate(req.body);
      if (error) throw new InvariantError(error.message);

      const existingNote = await repo.getById(id);
      if (!existingNote) throw new NotFoundError("Catatan tidak ditemukan");

      verifyOwner(existingNote, value.username, value.password);
      await repo.delete(id);

      return sendSuccessResponse(res, null, "Catatan berhasil dihapus");
    } catch (err) {
      next(err);
    }
  },
});
