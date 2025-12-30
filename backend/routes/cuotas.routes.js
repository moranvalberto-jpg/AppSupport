import express from "express";
import { connection } from "../config/database.js";

const router = express.Router();

/* ===============================
   REGISTRAR CUOTA
================================ */
router.post("/agremiados/:id/cuotas", (req, res) => {
  const { id } = req.params;
  const { tipo, monto } = req.body;

  if (!tipo || !monto) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  const sql = `
    INSERT INTO cuotas (agremiado_id, tipo, monto)
    VALUES (?, ?, ?)
  `;

  connection.query(sql, [id, tipo, monto], (err, result) => {
    if (err) {
      console.error("❌ Error al registrar cuota:", err);
      return res.status(500).json({ message: "Error al registrar cuota" });
    }

    res.json({ message: "Cuota registrada correctamente" });
  });
});

/* ===============================
   HISTORIAL DE CUOTAS
================================ */
router.get("/agremiados/:id/cuotas", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id, tipo, monto, fecha
    FROM cuotas
    WHERE agremiado_id = ?
    ORDER BY fecha DESC
  `;

  connection.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener cuotas:", err);
      return res.status(500).json({ message: "Error al obtener cuotas" });
    }

    res.json(rows || []);
  });
});

/* ===============================
   TOTALES
================================ */
router.get("/agremiados/:id/cuotas/totales", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      SUM(CASE WHEN tipo = 'sindical' THEN monto ELSE 0 END) AS total_sindical,
      SUM(CASE WHEN tipo = 'abogado' THEN monto ELSE 0 END) AS total_abogado
    FROM cuotas
    WHERE agremiado_id = ?
  `;

  connection.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("❌ Error totales:", err);
      return res.status(500).json({ message: "Error al obtener totales" });
    }

    res.json(rows[0]);
  });
});

export default router;
