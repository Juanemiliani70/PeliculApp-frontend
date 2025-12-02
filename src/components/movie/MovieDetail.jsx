import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MovieDetail = () => {
  const { imdb_id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/movie/${imdb_id}`);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la película.");
      }
    };
    fetchMovie();
  }, [imdb_id]);

  if (error) return <p className="text-center mt-4">{error}</p>;
  if (!movie) return <p className="text-center mt-4">Cargando...</p>;

  return (
    <div className="container mt-4 p-3 rounded shadow-sm bg-white">
      <div className="row">
        {/* Imagen */}
        <div className="col-md-5 mb-3">
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="img-fluid rounded shadow-sm"
          />
        </div>

        {/* Información */}
        <div className="col-md-7">
          <h2 className="mt-3 mt-md-0">{movie.title}</h2>

          {/* Descripción */}
          <h5>Descripción</h5>
          <p className="text-muted">{movie.description || "No hay descripción disponible."}</p>

          {/* Review Admin */}
          <h5>Reseña del Admin</h5>
          <p className="text-secondary">{movie.admin_review || "No hay reseña disponible."}</p>

          {/* Botones */}
          <div className="d-flex gap-2 mt-3 flex-wrap">
            <a
              href={`https://www.youtube.com/watch?v=${movie.youtube_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-trailer"
            >
              Ver Trailer
            </a>

           <a
              href={movie.watch_url}         
              target="_blank"                 
              rel="noopener noreferrer"       
              className="btn btn-watch"
           >
                Ver Película
           </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
