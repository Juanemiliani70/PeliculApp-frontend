import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosConfig";

const SearchMovies = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query"); 

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/search?title=${query}`);
        setMovies(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error buscando películas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  return (
    <div className="container mt-4">
      {loading && <p className="text-light">Buscando...</p>}
      {!loading && movies.length === 0 && (
        <p className="text-secondary">No se encontraron películas.</p>
      )}

      <div className="row">
        {movies.map((movie) => (
          <div key={movie.imdb_id} className="col-md-3 mb-4">
            <div className="card h-100 bg-white text-light border-secondary">
              <img
                src={movie.poster_path}
                alt={movie.title}
                className="card-img-top"
                style={{ height: "380px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-dark">{movie.title}</h5>
                <Link
                  to={`/movie/${movie.imdb_id}`}
                  className="btn btn-primary w-100 mt-auto"
                  style={{ borderRadius: 5, textAlign: "center" }}
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchMovies;
