import { noteSchema, authCheckSchema } from "../validator/schema.js";
import * as repo from "../repositories/doaRepository.js";
import InvariantError from "../../../exceptions/invariantError.js";
import NotFoundError from "../../../exceptions/notFoundError.js";
import AuthenticationError from "../../../exceptions/authenticationError.js";
import sendSuccessResponse from "../../../utils/response.js";
import { nanoid } from "nanoid";
import { supabase } from "../../../config/database.js";

const verifyOwner = (note, username, password) => {
  if (note.username !== username || note.password !== password) {
    throw new AuthenticationError("Username atau password salah");
  }
};

// Helper untuk mengambil path mentah file dari URL atau path
const extractStoragePath = (urlOrPath) => {
  if (!urlOrPath) return "";
  const parts = urlOrPath.split("/catatan-bersama/");
  const path = parts.length > 1 ? parts[1] : urlOrPath;
  return path.split("?")[0]; // Hapus query params jika ada
};

// Helper untuk membuat Signed URL sementara (berlaku 1 jam / 3600 detik)
const getSignedUrls = async (paths) => {
  if (!paths || paths.length === 0) return [];
  const cleanPaths = paths.map(extractStoragePath).filter(Boolean);
  if (cleanPaths.length === 0) return [];

  const { data, error } = await supabase.storage
    .from("catatan-bersama")
    .createSignedUrls(cleanPaths, 3600);

  if (error || !data) return [];
  return data.map((item) => item.signedUrl);
};

export const getAllHandler = async (req, res, next) => {
  try {
    const { search } = req.query;
    const rawData = await repo.getAlldoa(search || "");

    // Generate Signed URL untuk setiap file PDF di item
    const data = await Promise.all(
      rawData.map(async (item) => ({
        ...item,
        pdf_paths: await getSignedUrls(item.pdf_paths),
      })),
    );

    return sendSuccessResponse(res, data);
  } catch (err) {
    next(err);
  }
};

export const createHandler = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new InvariantError("File PDF wajib diunggah minimal 1 file");
    }

    const { error, value } = noteSchema.validate(req.body);
    if (error) throw new InvariantError(error.message);

    const id = nanoid(16);

    const uploadPromises = req.files.map(async (file, index) => {
      // 1. Perbaiki encoding UTF-8 untuk teks Arab dari Multer
      const correctName = Buffer.from(file.originalname, "latin1").toString(
        "utf8",
      );
      // 2. Ubah nama file ke format HEX agar aman disimpan di Supabase Storage
      const hexName = Buffer.from(correctName).toString("hex");
      const fileName = `${id}-${Date.now()}-${index}-${hexName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("catatan-bersama")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype || "application/pdf",
          upsert: true,
        });

      if (uploadError) throw new InvariantError(uploadError.message);

      return uploadData.path;
    });

    const pdf_paths = await Promise.all(uploadPromises);

    const data = await repo.createdoa({
      id,
      ...value,
      pdf_paths,
    });

    data.pdf_paths = await getSignedUrls(pdf_paths);

    return sendSuccessResponse(res, data, "Catatan berhasil dibuat", 201);
  } catch (err) {
    next(err);
  }
};

export const updateHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { existingPdfPaths, ...bodyToValidate } = req.body;
    const { error, value } = noteSchema.validate(bodyToValidate);
    if (error) throw new InvariantError(error.message);

    const existingNote = await repo.getdoaById(id);
    if (!existingNote) throw new NotFoundError("Catatan tidak ditemukan");

    verifyOwner(existingNote, value.username, value.password);

    let remainingPaths = [];
    if (existingPdfPaths) {
      const arr = Array.isArray(existingPdfPaths)
        ? existingPdfPaths
        : [existingPdfPaths];
      remainingPaths = arr.map(extractStoragePath).filter(Boolean);
    }

    const oldPaths = (existingNote.pdf_paths || [])
      .map(extractStoragePath)
      .filter(Boolean);
    const pathsToDelete = oldPaths.filter(
      (path) => !remainingPaths.includes(path),
    );

    if (pathsToDelete.length > 0) {
      await supabase.storage.from("catatan-bersama").remove(pathsToDelete);
    }

    let newPaths = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file, index) => {
        // 1. Perbaiki encoding UTF-8 untuk teks Arab dari Multer
        const correctName = Buffer.from(file.originalname, "latin1").toString(
          "utf8",
        );
        // 2. Ubah nama file ke format HEX agar aman disimpan di Supabase Storage
        const hexName = Buffer.from(correctName).toString("hex");
        const fileName = `${id}-${Date.now()}-${index}-${hexName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("catatan-bersama")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype || "application/pdf",
            upsert: true,
          });

        if (uploadError) throw new InvariantError(uploadError.message);

        return uploadData.path;
      });

      newPaths = await Promise.all(uploadPromises);
    }

    const finalPaths = [...remainingPaths, ...newPaths];

    const updated = await repo.updatedoa(id, {
      ...value,
      pdf_paths: finalPaths,
    });
    updated.pdf_paths = await getSignedUrls(finalPaths);

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

    const existingNote = await repo.getdoaById(id);
    if (!existingNote) throw new NotFoundError("Catatan tidak ditemukan");

    verifyOwner(existingNote, value.username, value.password);

    if (existingNote.pdf_paths && existingNote.pdf_paths.length > 0) {
      const pathsToRemove = existingNote.pdf_paths.map(extractStoragePath);
      await supabase.storage.from("catatan-bersama").remove(pathsToRemove);
    }

    await repo.deletedoa(id);

    return sendSuccessResponse(res, null, "Catatan berhasil dihapus");
  } catch (err) {
    next(err);
  }
};
