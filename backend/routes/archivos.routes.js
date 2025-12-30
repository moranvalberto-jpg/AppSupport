import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { connection } from "../config/database.js";

const router = express.Router();

// 📁 Crear carpeta uploads si no existe
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// 📦 Configuración multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Solo se permiten archivos PDF"));
    }
    cb(null, true);
  },
});

// 📄 Obtener archivos de un agremiado
router.get("/agremiados/:id/archivos", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id, nombre_original, ruta, creado_en
    FROM archivos
    WHERE agremiado_id = ?
    ORDER BY creado_en DESC
  `;

  connection.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error al obtener archivos" });
    res.json(rows);
  });
});

// ⬆️ Subir archivo
router.post(
  "/agremiados/:id/archivos",
  upload.single("archivo"),
  (req, res) => {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    const { originalname, filename } = req.file;

    const sql = `
      INSERT INTO archivos (agremiado_id, nombre_original, ruta)
      VALUES (?, ?, ?)
    `;

    connection.query(
      sql,
      [id, originalname, `uploads/${filename}`],
      (err) => {
        if (err) return res.status(500).json({ message: "Error al guardar archivo" });
        res.json({ message: "Archivo subido correctamente" });
      }
    );
  }
);

// 🗑️ Eliminar archivo
router.delete("/archivos/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT ruta FROM archivos WHERE id = ?";
  connection.query(sql, [id], (err, rows) => {
    if (err || rows.length === 0)
      return res.status(404).json({ message: "Archivo no encontrado" });

    const ruta = rows[0].ruta;

    fs.unlink(ruta, () => {
      connection.query(
        "DELETE FROM archivos WHERE id = ?",
        [id],
        () => res.json({ message: "Archivo eliminado" })
      );
    });
  });
});

export default router;
