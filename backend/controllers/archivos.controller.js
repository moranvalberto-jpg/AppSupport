// controllers/archivos.controller.js
const { Archivo } = require("../models");

exports.subirArchivo = async (req, res) => {
  try {
    const archivo = await Archivo.create({
      agremiado_id: req.params.id,
      nombre_original: req.file.originalname,
      ruta: req.file.path
    });
    res.json(archivo);
  } catch (error) {
    res.status(500).json({ message: "Error al subir archivo" });
  }
};

exports.obtenerArchivos = async (req, res) => {
  const archivos = await Archivo.findAll({
    where: { agremiado_id: req.params.id }
  });
  res.json(archivos);
};

exports.eliminarArchivo = async (req, res) => {
  await Archivo.destroy({ where: { id: req.params.id } });
  res.json({ message: "Archivo eliminado" });
};
