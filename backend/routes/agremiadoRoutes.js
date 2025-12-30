import express from "express";
import { proteger, permitirRoles } from "../middlewares/authMiddleware.js";
import { getAgremiados, createAgremiado, updateAgremiado, deleteAgremiado } from "../controllers/agremiadoController.js";

const router = express.Router();

router.get("/", proteger, permitirRoles("SuperAdmin", "Capturista"), getAgremiados);
router.post("/", proteger, permitirRoles("SuperAdmin", "Capturista"), createAgremiado);
router.put("/:id", proteger, permitirRoles("SuperAdmin", "Capturista"), updateAgremiado);
router.delete("/:id", proteger, permitirRoles("SuperAdmin"), deleteAgremiado);

export default router;
