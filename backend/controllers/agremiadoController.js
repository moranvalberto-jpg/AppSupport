import { connection } from "../config/database.js";

// 📌 Obtener todos los agremiados
export const getAgremiados = (req, res) => {
    const sql = "SELECT * FROM agremiados ORDER BY created_at DESC";

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error al obtener agremiados" });
        }
        res.json(results);
    });
};

// 📌 Crear agremiado
export const createAgremiado = (req, res) => {
    const {
        numero_empleado,
        nombre,
        apellido_paterno,
        apellido_materno,
        dependencia,
        curp,
        rfc,
        telefono,
        email,
        estatus,
        fecha_ingreso
    } = req.body;

    const sql = `
        INSERT INTO agremiados
        (numero_empleado, nombre, apellido_paterno, apellido_materno, dependencia, curp, rfc, telefono, email, estatus, fecha_ingreso)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [
            numero_empleado,
            nombre,
            apellido_paterno,
            apellido_materno,
            dependencia,
            curp,
            rfc,
            telefono,
            email,
            estatus,
            fecha_ingreso
        ],
        (err) => {
            if (err) {
                return res.status(500).json({ message: "Error al crear agremiado" });
            }
            res.json({ message: "Agremiado creado correctamente" });
        }
    );
};

// 📌 Actualizar agremiado
export const updateAgremiado = (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const sql = "UPDATE agremiados SET ? WHERE id = ?";

    connection.query(sql, [data, id], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error al actualizar agremiado" });
        }
        res.json({ message: "Agremiado actualizado correctamente" });
    });
};

// 📌 Eliminar agremiado
export const deleteAgremiado = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM agremiados WHERE id = ?";

    connection.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({ message: "Error al eliminar agremiado" });
        }
        res.json({ message: "Agremiado eliminado correctamente" });
    });
};
