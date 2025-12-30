import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connection } from "./config/database.js";

import userRoutes from "./routes/userRoutes.js";
import agremiadoRoutes from "./routes/agremiadoRoutes.js";
import archivosRoutes from "./routes/archivos.routes.js";
import cuotasRoutes from "./routes/cuotas.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Archivos estáticos
app.use("/uploads", express.static("uploads"));

// Rutas
app.use("/api/usuarios", userRoutes);
app.use("/api/agremiados", agremiadoRoutes);
app.use("/api", archivosRoutes);
app.use("/api", cuotasRoutes);

// Test
app.get("/", (req, res) => {
  res.send("Servidor AppSupport activo 🚀");
});

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
