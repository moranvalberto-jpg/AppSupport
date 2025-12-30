import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connection } from "../config/database.js";

// Generar token
const generarToken = (id, rol) => jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registrarUsuario = (req, res) => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password) return res.status(400).json({ mensaje: "Faltan campos obligatorios" });

  const hash = bcrypt.hashSync(password, 10);

  connection.query(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?,?,?,?)",
    [nombre, email, hash, rol || "Capturista"],
    (err) => {
      if (err) return res.status(500).json({ mensaje: "Error al registrar usuario", error: err });
      res.status(201).json({ mensaje: "Usuario registrado correctamente" });
    }
  );
};

export const loginUsuario = (req, res) => {
  const { email, password } = req.body;

  connection.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error en el servidor" });
    if (results.length === 0) return res.status(400).json({ mensaje: "Usuario no encontrado" });

    const usuario = results[0];
    if (!bcrypt.compareSync(password, usuario.password)) return res.status(400).json({ mensaje: "Contraseña incorrecta" });

    const token = generarToken(usuario.id, usuario.rol);
    res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, token });
  });
};

export const obtenerUsuarios = (req, res) => {
  connection.query("SELECT id, nombre, email, rol FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener usuarios" });
    res.json(results);
  });
};
