// pages/Usuarios.jsx
import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchUsuarios = async () => {
    try {
      const res = await api.get("/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;

    try {
      await api.delete(`/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario", error);
    }
  };

  return (
    <>
      <Navbar user={user} />

      <Container className="mt-4">
        <h2>Usuarios</h2>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.rol}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2">
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleEliminar(u.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Usuarios;
