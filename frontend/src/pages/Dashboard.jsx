// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <>
      <Navbar user={user} />

      <Container className="mt-4">
        <h2 className="mb-4">Bienvenido, {user.nombre}</h2>

        <Row>
          {user.rol === "SuperAdmin" && (
            <Col md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>Usuarios</Card.Title>
                  <Card.Text>
                    Administración de usuarios del sistema
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/usuarios")}
                  >
                    Gestionar Usuarios
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}

          {["SuperAdmin", "Capturista"].includes(user.rol) && (
            <Col md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>Agremiados</Card.Title>
                  <Card.Text>
                    Alta, edición y consulta de agremiados
                  </Card.Text>
                  <Button
                    variant="success"
                    onClick={() => navigate("/agremiados")}
                  >
                    Ver Agremiados
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
