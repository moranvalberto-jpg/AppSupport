import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";

const initialState = {
  numero_empleado: "",
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  dependencia: "",
  curp: "",
  rfc: "",
  telefono: "",
  email: "",
  estatus: "Activo",
  fecha_ingreso: "",
};

const AgremiadosForm = ({ onAgremiadoCreado, agremiadoEditar, onCancelEditar }) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const editando = Boolean(agremiadoEditar?.id);

  // 🔁 Cargar datos al editar
  useEffect(() => {
    if (editando) {
      setFormData({
        ...initialState,
        ...agremiadoEditar,
      });
    }
  }, [agremiadoEditar]);

  // Campos en MAYÚSCULAS
  const upperFields = [
    "nombre",
    "apellido_paterno",
    "apellido_materno",
    "dependencia",
    "curp",
    "rfc",
  ];

  const lowerFields = ["email"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (upperFields.includes(name)) newValue = value.toUpperCase();
    if (lowerFields.includes(name)) newValue = value.toLowerCase();

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (editando) {
        // ✏️ EDITAR
        await axios.put(
          `http://localhost:4000/api/agremiados/${agremiadoEditar.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("✏️ Agremiado actualizado correctamente");
      } else {
        // ➕ CREAR
        await axios.post(
          "http://localhost:4000/api/agremiados",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("✅ Agremiado registrado correctamente");
      }

      setFormData(initialState);
      onAgremiadoCreado?.();
      onCancelEditar?.();

    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message ||
          "❌ Error de conexión con el servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title className="mb-4">
          {editando ? "Editar Agremiado" : "Registro de Agremiado"}
        </Card.Title>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Número de empleado</Form.Label>
                <Form.Control
                  name="numero_empleado"
                  value={formData.numero_empleado}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>CURP</Form.Label>
                <Form.Control
                  name="curp"
                  value={formData.curp}
                  onChange={handleChange}
                  maxLength={18}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>RFC</Form.Label>
                <Form.Control
                  name="rfc"
                  value={formData.rfc}
                  onChange={handleChange}
                  maxLength={13}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido Paterno</Form.Label>
                <Form.Control
                  name="apellido_paterno"
                  value={formData.apellido_paterno}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido Materno</Form.Label>
                <Form.Control
                  name="apellido_materno"
                  value={formData.apellido_materno}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Dependencia</Form.Label>
                <Form.Control
                  name="dependencia"
                  value={formData.dependencia}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de ingreso</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_ingreso"
                  value={formData.fecha_ingreso}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Estatus</Form.Label>
                <Form.Select
                  name="estatus"
                  value={formData.estatus}
                  onChange={handleChange}
                >
                  <option value="Activo">Activo</option>
                  <option value="Baja">Baja</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            {editando && (
              <Button
                variant="secondary"
                onClick={() => {
                  setFormData(initialState);
                  onCancelEditar?.();
                }}
              >
                Cancelar
              </Button>
            )}

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Guardando...
                </>
              ) : editando ? (
                "Actualizar"
              ) : (
                "Guardar Agremiado"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AgremiadosForm;
