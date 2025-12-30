import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { Button, Table, Form } from "react-bootstrap";

const ExpedienteAgremiado = ({ agremiado }) => {
    const [archivo, setArchivo] = useState(null);
    const [archivos, setArchivos] = useState([]);
    const fileInputRef = useRef(null);

    const token = localStorage.getItem("token");

    const cargarArchivos = async () => {
        try {
            const res = await api.get(
                `/api/agremiados/${agremiado.id}/archivos`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setArchivos(res.data);
        } catch (error) {
            console.error(error);
            alert("❌ Error al cargar archivos");
        }
    };

    useEffect(() => {
        if (agremiado?.id) {
            cargarArchivos();
        }
    }, [agremiado]);

    const handleSubirArchivo = async (e) => {
        e.preventDefault();

        if (!archivo) {
            alert("Selecciona un archivo PDF");
            return;
        }

        const formData = new FormData();
        formData.append("archivo", archivo);

        try {
            await api.post(
                `/api/agremiados/${agremiado.id}/archivos`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("📄 Archivo subido correctamente");
            setArchivo(null);
            fileInputRef.current.value = "";
            cargarArchivos();
        } catch (error) {
            console.error(error);
            alert("❌ Error al subir archivo");
        }
    };

    const eliminarArchivo = async (id) => {
        if (!window.confirm("¿Eliminar archivo?")) return;

        try {
            await api.delete(
                `/api/archivos/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            cargarArchivos();
        } catch (error) {
            console.error(error);
            alert("❌ Error al eliminar archivo");
        }
    };

    return (
        <>
            {/* SUBIR ARCHIVO */}
            <Form onSubmit={handleSubirArchivo} className="mb-3">
                <Form.Group>
                    <Form.Label>Subir archivo (PDF)</Form.Label>
                    <Form.Control
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        onChange={(e) => setArchivo(e.target.files[0])}
                    />
                </Form.Group>

                <Button type="submit" className="mt-2">
                    Subir
                </Button>
            </Form>

            {/* LISTADO */}
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Archivo</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {archivos.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center">
                                Sin archivos
                            </td>
                        </tr>
                    ) : (
                        archivos.map((a) => (
                            <tr key={a.id}>
                                <td>{a.nombre_original}</td>
                                <td>{new Date(a.fecha_subida).toLocaleDateString()}</td>
                                <td>
                                    <a
                                        href={`/${a.ruta}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-sm btn-success me-2"
                                    >
                                        Ver
                                    </a>

                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => eliminarArchivo(a.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </>
    );
};

export default ExpedienteAgremiado;
