import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import AgremiadosForm from "../components/AgremiadosForm";
import ExpedienteAgremiado from "../components/ExpedienteAgremiado";
import CuotasAgremiado from "../components/CuotasAgremiado";
import { Table, Badge, Modal, Button } from "react-bootstrap";

/* 🔹 Convierte dd/mm/yyyy → yyyy-mm-dd */
const convertirFechaParaInput = (fecha) => {
  if (!fecha) return "";
  if (fecha.includes("/")) {
    const [dia, mes, anio] = fecha.split("/");
    return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  }
  return fecha;
};

const Agremiados = () => {
  const [agremiados, setAgremiados] = useState([]);
  const [filtro, setFiltro] = useState("");

  // ✏️ Editar
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [agremiadoEditar, setAgremiadoEditar] = useState(null);

  // 📁 Expediente
  const [showExpediente, setShowExpediente] = useState(false);
  const [agremiadoExpediente, setAgremiadoExpediente] = useState(null);

  // 💰 Cuotas
  const [showCuotas, setShowCuotas] = useState(false);
  const [agremiadoSeleccionado, setAgremiadoSeleccionado] = useState(null);

  const token = localStorage.getItem("token");

  /* 🔹 Obtener agremiados */
  const fetchAgremiados = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/agremiados", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgremiados(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al obtener agremiados:", error);
    }
  };

  useEffect(() => {
    fetchAgremiados();
  }, []);

  /* 🔍 Filtro */
  const agremiadosFiltrados = agremiados.filter((a) => {
    const texto = filtro.toLowerCase();
    return (
      a.numero_empleado?.toLowerCase().includes(texto) ||
      a.nombre?.toLowerCase().includes(texto) ||
      a.apellido_paterno?.toLowerCase().includes(texto) ||
      a.dependencia?.toLowerCase().includes(texto)
    );
  });

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2 className="mb-3">Agremiados</h2>

        <input
          className="form-control mb-4"
          placeholder="Buscar por nombre, número o dependencia..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <AgremiadosForm onAgremiadoCreado={fetchAgremiados} />

        <Table striped bordered hover className="mt-4">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>No. Empleado</th>
              <th>Nombre</th>
              <th>Dependencia</th>
              <th>Estatus</th>
              <th>Ingreso</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {agremiadosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay registros
                </td>
              </tr>
            ) : (
              agremiadosFiltrados.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.numero_empleado}</td>
                  <td>{a.nombre} {a.apellido_paterno}</td>
                  <td>{a.dependencia}</td>
                  <td>
                    <Badge bg={a.estatus === "Activo" ? "success" : "secondary"}>
                      {a.estatus}
                    </Badge>
                  </td>
                  <td>{a.fecha_ingreso}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => {
                        setAgremiadoEditar({
                          ...a,
                          fecha_ingreso: convertirFechaParaInput(a.fecha_ingreso),
                        });
                        setShowModalEditar(true);
                      }}
                    >
                      Editar
                    </Button>

                    <Button
                      size="sm"
                      variant="info"
                      className="me-2"
                      onClick={() => {
                        setAgremiadoExpediente(a);
                        setShowExpediente(true);
                      }}
                    >
                      Detalles
                    </Button>

                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => {
                        setAgremiadoSeleccionado(a);
                        setShowCuotas(true);
                      }}
                    >
                      Cuotas
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* ✏️ Modal Editar */}
      <Modal show={showModalEditar} onHide={() => setShowModalEditar(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Agremiado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {agremiadoEditar && (
            <AgremiadosForm
              agremiadoEditar={agremiadoEditar}
              onAgremiadoCreado={() => {
                fetchAgremiados();
                setShowModalEditar(false);
                setAgremiadoEditar(null);
              }}
              onCancelEditar={() => {
                setShowModalEditar(false);
                setAgremiadoEditar(null);
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* 📁 Modal Expediente */}
      <Modal show={showExpediente} onHide={() => setShowExpediente(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Expediente de {agremiadoExpediente?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {agremiadoExpediente && (
            <ExpedienteAgremiado agremiado={agremiadoExpediente} />
          )}
        </Modal.Body>
      </Modal>

      {/* 💰 Modal Cuotas */}
      {showCuotas && agremiadoSeleccionado && (
        <CuotasAgremiado
          agremiado={agremiadoSeleccionado}
          show={showCuotas}
          onHide={() => setShowCuotas(false)}
        />
      )}
    </>
  );
};

export default Agremiados;
