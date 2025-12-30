import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Table } from "react-bootstrap";

const CuotasAgremiado = ({ agremiado, show, onHide }) => {
  const [tipo, setTipo] = useState("sindical");
  const [monto, setMonto] = useState("");
  const [cuotas, setCuotas] = useState([]);
  const [totales, setTotales] = useState({});

  const cargarCuotas = async () => {
    const res = await axios.get(
      `http://localhost:4000/api/agremiados/${agremiado.id}/cuotas`
    );
    setCuotas(res.data);
  };

  const cargarTotales = async () => {
    const res = await axios.get(
      `http://localhost:4000/api/agremiados/${agremiado.id}/cuotas/totales`
    );
    setTotales(res.data);
  };

  useEffect(() => {
    if (show) {
      cargarCuotas();
      cargarTotales();
    }
  }, [show]);

  const registrarCuota = async (e) => {
    e.preventDefault();

    await axios.post(
      `http://localhost:4000/api/agremiados/${agremiado.id}/cuotas`,
      { tipo, monto }
    );

    setMonto("");
    cargarCuotas();
    cargarTotales();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Cuotas – {agremiado.nombre}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* FORMULARIO */}
        <Form onSubmit={registrarCuota} className="mb-3">
          <Form.Group>
            <Form.Label>Tipo de cuota</Form.Label>
            <Form.Select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="sindical">Sindical</option>
              <option value="abogado">Abogado</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="mt-3">
            Registrar cuota
          </Button>
        </Form>

        {/* TOTALES */}
        <div className="mb-3">
          <strong>Total Sindical:</strong> ${totales.total_sindical || 0} <br />
          <strong>Total Abogado:</strong> ${totales.total_abogado || 0}
        </div>

        {/* HISTORIAL */}
        <Table bordered hover>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {cuotas.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  Sin cuotas registradas
                </td>
              </tr>
            ) : (
              cuotas.map((c) => (
                <tr key={c.id}>
                  <td>{c.tipo}</td>
                  <td>${c.monto}</td>
                  <td>{new Date(c.fecha).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default CuotasAgremiado;
