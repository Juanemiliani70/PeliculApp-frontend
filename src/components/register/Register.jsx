import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axiosClient from '../../api/axiosConfig';
import { useNavigate, Link } from "react-router-dom";
import logo from '../../img_app/logo.png'; 

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [genres, setGenres] = useState([]);
    const [favouriteGenres, setFavouriteGenres] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenreChange = (e) => {
        const options = Array.from(e.target.selectedOptions);
        setFavouriteGenres(options.map(opt => ({
            genre_id: Number(opt.value),
            genre_name: opt.label
        })));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const defaultRole = "USER";

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                role: defaultRole,
                favourite_genres: favouriteGenres
            };
            const response = await axiosClient.post('/register', payload);
            if (response.data.error) {
                setError(response.data.error);
                return;
            }
            navigate('/login', { replace: true });
        } catch (err) {
            setError('Error al registrarse. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axiosClient.get('/genres');
                setGenres(response.data);
            } catch (error) {
                console.error('Error al obtener generos:', error);
            }
        };
        fetchGenres();
    }, []);

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <div className="shadow p-4 rounded bg-white" style={{ maxWidth: 430, width: '100%' }}>
                <div className="text-center mb-4">
                    <img src={logo} alt="PeliculApp Logo" style={{ width: 120, height: 'auto' }} className="mb-3" />
                    <h2 className="fw-bold">Crear cuenta</h2>
                    <p className="text-muted">¡Únete a PeliculApp y disfruta del mejor cine!</p>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                </div>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ej: Juan"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ej: Emiliani"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="tuemail@mail.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirmar contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            isInvalid={!!confirmPassword && password !== confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            Las contraseñas no coinciden.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Géneros favoritos</Form.Label>
                        <Form.Select
                            multiple
                            value={favouriteGenres.map(g => String(g.genre_id))}
                            onChange={handleGenreChange}
                        >
                            {genres.map(genre => (
                                <option
                                    key={genre.genre_id}
                                    value={genre.genre_id}
                                    label={genre.genre_name}
                                >
                                    {genre.genre_name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Mantén Ctrl (Windows) o Cmd (Mac) para seleccionar más de uno.
                        </Form.Text>
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mb-2"
                        disabled={loading}
                        style={{ fontWeight: 600, letterSpacing: 1 }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creando cuenta...
                            </>
                        ) : 'Registrarse'}
                    </Button>
                </Form>

                <div className="text-center mt-3">
                    <span className="text-muted">¿Ya tienes cuenta? </span>
                    <Link to="/login" className="fw-semibold">Inicia sesión aquí</Link>
                </div>
            </div>
        </Container>
    )
}

export default Register;
