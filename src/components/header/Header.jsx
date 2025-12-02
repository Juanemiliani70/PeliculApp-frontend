import { useState } from "react";
import { Navbar, Container, Form, Button, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img_app/logo.png";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  
  const handleLogoClick = () => {
    sessionStorage.setItem("resetGenre", "1");
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?query=${encodeURIComponent(search)}`);
    setSearch("");
    setShowMobileSearch(false);
  };

  const handleLogout = () => {
    setAuth(null);
    navigate("/login");
  };

  return (
    <Navbar expand="md" fixed="top" className="header-navbar" variant="dark">
      <Container fluid>

        <Link
          to="/"
          onClick={() => sessionStorage.setItem("resetGenre", "1")}
          className="navbar-brand d-flex align-items-center p-0"
          style={{ cursor: "pointer" }}
        >
        <img src={logo} alt="PeliculApp Logo" className="header-logo" />
        </Link>


        {/* HAMBURGUESA */}
        <Navbar.Toggle aria-controls="navbarScroll" className="header-toggler" />

        <Navbar.Collapse id="navbarScroll">

          {/* DESKTOP SEARCH */}
          <Form
            className="header-search-form d-none d-md-flex ms-3 flex-grow-1"
            onSubmit={handleSearchSubmit}
          >
            <Form.Control
              type="text"
              placeholder="Buscar película..."
              className="header-input me-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" className="header-search-btn">
              Buscar
            </Button>
          </Form>

          {/* DESKTOP USER + LOGOUT */}
          <Nav className="d-none d-md-flex ms-auto align-items-center">
            {auth?.firstName && (
              <span className="header-user me-3">
                Hola, <strong className="header-username">{auth.firstName}</strong>
              </span>
            )}
            {auth?.firstName && (
              <Button className="header-logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            )}
          </Nav>

          {/* MOBILE SEARCH + LOGOUT */}
          <div className="d-md-none w-100 mt-2">
            <Form onSubmit={handleSearchSubmit} className="mb-2">
              <Form.Control
                type="text"
                placeholder="Buscar película..."
                className="mobile-search-input mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button type="submit" className="mobile-search-btn w-100">
                Buscar
              </Button>
            </Form>

            <Nav className="mt-2">
              {auth?.firstName && (
                <Button
                  className="header-logout-btn w-100 mb-2"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Button>
              )}
            </Nav>
          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
