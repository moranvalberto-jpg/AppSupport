import { Navbar as BsNavbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg">
      <Container>

        {/* 🔹 BRAND COMO LINK REAL */}
        <BsNavbar.Brand
          as={Link}
          to="/dashboard"
          style={{ cursor: "pointer" }}
        >
          AppSupport
        </BsNavbar.Brand>

        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/dashboard">
            Dashboard
          </Nav.Link>

          {["SuperAdmin", "Capturista"].includes(user?.rol) && (
            <Nav.Link as={Link} to="/agremiados">
              Agremiados
            </Nav.Link>
          )}

          {user?.rol === "SuperAdmin" && (
            <Nav.Link as={Link} to="/usuarios">
              Usuarios
            </Nav.Link>
          )}

          <Nav.Link
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Salir
          </Nav.Link>
        </Nav>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
