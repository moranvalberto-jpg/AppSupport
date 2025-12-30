import express from "express";
import { proteger, soloAdmin } from "../middlewares/authMiddleware.js";
import { registrarUsuario, loginUsuario, obtenerUsuarios } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", proteger, soloAdmin, registrarUsuario);
router.post("/login", loginUsuario);
router.get("/", proteger, soloAdmin, obtenerUsuarios);

export default router;
