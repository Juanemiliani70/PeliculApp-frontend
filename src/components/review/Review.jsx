import { Form, Button } from 'react-bootstrap';
import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import Movie from '../movie/Movie';
import { Spinner } from 'react-bootstrap';



const Review = () => {
    const [movie, setMovie] = useState({});
    const [loading, setLoading] = useState(false);
    const revText = useRef();
    const { imdb_id } = useParams();
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    // Cargar los datos de la película
    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get(`/movie/${imdb_id}`);
                setMovie(response.data);
            } catch (error) {
                console.error('Error al obtener la película:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [imdb_id]);

    // Enviar la review del admin
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosPrivate.patch(`/updatereview/${imdb_id}`, { admin_review: revText.current.value });
            setMovie({
                ...movie,
                admin_review: response.data?.admin_review ?? movie.admin_review,
                ranking: {
                    ranking_name: response.data?.ranking_name ?? movie.ranking?.ranking_name
                }
            });
        } catch (err) {
            console.error('Error al actualizar la reseña:', err);
            if (err.response && err.response.status === 401) {
                console.error('Acceso no autorizado - redirigiendo a login');
                localStorage.removeItem('user');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        {loading ? (
            <Spinner />
        ) : (
            <div className="container py-5">
                <h2 className="text-center mb-4">Reseña de Admin</h2>
                <div className="row justify-content-center">
                    {/* Columna de la película */}
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center mb-4 mb-md-0">
                        <div className="w-100 shadow rounded p-3 bg-white d-flex justify-content-center align-items-center">
                            <Movie movie={movie} />
                        </div>
                    </div>

                    {/* Columna de la review */}
                    <div className="col-12 col-md-6 d-flex align-items-stretch">
                        <div className="w-100 shadow rounded p-4 bg-white">
                            {auth && auth.role === "ADMIN" ? (
                                
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="adminReviewTextarea">
                                        <Form.Label className="fw-semibold">Reseña de Admin</Form.Label>
                                        <Form.Control
                                            ref={revText}
                                            required
                                            as="textarea"
                                            rows={8}
                                            defaultValue={movie?.admin_review}
                                            placeholder="Escribe tu reseña aquí..."
                                            className="peliculapp-input"
                                            style={{ resize: "vertical" }}
                                        />
                                    </Form.Group>
                                    <Button
                                        variant="info"
                                        type="submit"
                                        className="peliculapp-btn w-100 py-2"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Enviando...
                                            </>
                                        ) : 'Enviar Reseña'}
                                    </Button>
                                </Form>
                            ) : (
                                <div className="alert alert-info">{movie.admin_review}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default Review;
