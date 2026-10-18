import { noteSchema, authCheckSchema } from "../validator/schema.js";
import * as repo from "../repositories/tugasHarianRepository.js";
import InvariantError from "../../../exceptions/invariantError.js";
import NotFoundError from "../../../exceptions/notFoundError.js";
import AuthenticationError from "../../../exceptions/authenticationError.js";
import sendSuccessResponse from "../../../utils/response.js";
import { nanoid } from "nanoid";

// Fungsi verifyOwner sekarang sinkron dan mengecek string secara langsung
const verifyOwner = (note, username, password) => {
  if (note.username !== username || note.password !== password) {
    throw new AuthenticationError("Username atau password salah");
  }
};

export const getAllHandler = async (req, res, next) => {
  try {
    const { search } = req.query;
    const data = await repo.getAlltugasHarian(search || "");
    return sendSuccessResponse(res, data);
  } catch (err) {
    next(err);
  }
};

export const createHandler = async (req, res, next) => {
  try {
    const { error, value } = noteSchema.validate(req.body);
    if (error) throw new InvariantError(error.message);

    // Buat ID acak
    const id = nanoid(16);

    // Masukkan id ke dalam objek data yang akan disimpan
    const data = await repo.createtugasHarian({ id, ...value });

    return sendSuccessResponse(res, data, "Catatan berhasil dibuat", 201);
  } catch (err) {
    next(err);
  }
};
export const updateHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = noteSchema.validate(req.body);
    if (error) throw new InvariantError(error.message);

    const existingNote = await repo.gettugasHarianById(id);
    if (!existingNote) throw new NotFoundError("Catatan tidak ditemukan");

    verifyOwner(existingNote, value.username, value.password);

    // Langsung mengupdate dengan value yang berisi password plain text
    const updated = await repo.updatetugasHarian(id, { ...value });

    return sendSuccessResponse(res, updated, "Catatan berhasil diperbarui");
  } catch (err) {
    next(err);
  }
};

export const deleteHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = authCheckSchema.validate(req.body);
    if (error) throw new InvariantError(error.message);

    const existingNote = await repo.gettugasHarianById(id);
    if (!existingNote) throw new NotFoundError("Catatan tidak ditemukan");

    verifyOwner(existingNote, value.username, value.password);
    await repo.deletetugasHarian(id);

    return sendSuccessResponse(res, null, "Catatan berhasil dihapus");
  } catch (err) {
    next(err);
  }
};
