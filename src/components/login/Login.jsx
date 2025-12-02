import { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axiosClient from "../../api/axiosConfig";
import useAuth from "../../hooks/useAuth";
import logo from "../../img_app/logo.png";

const Login = () => {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.post("/login", { email, password });

      setAuth({
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        email: response.data.email,
        role: response.data.role,
        userID: response.data.user_id,
        favouriteGenres: response.data.favourite_genres,
      });

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Correo electrónico o contraseña inválidos");
      } else {
        setError("Ocurrió un error. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="login-container d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-card shadow p-4 rounded bg-white" style={{ maxWidth: 400, width: "100%" }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" style={{ width: "120px", height: "auto" }} className="mb-2" />
          <h2 className="fw-bold">Iniciar sesión</h2>
          <p className="text-muted">¡Bienvenido! Por favor, ingresa a tu cuenta.</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-2" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <span className="text-muted">¿No tienes una cuenta? </span>
          <Link to="/register" className="fw-semibold">Regístrate aquí</Link>
        </div>
      </div>
    </Container>
  );
};

export default Login;
