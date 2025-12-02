import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from '../../api/axiosConfig';
import Movies from "../movies/Movies";
import '../../App.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();

  // Mapa de traducción:  inglés | español
  const genreMap = {
    Comedy: "Comedia",
    Drama: "Drama",
    Western: "Western",
    Fantasy: "Fantasía",
    Thriller: "Thriller",
    "Sci-Fi": "Ciencia ficción",
    Action: "Acción",
    Mystery: "Misterio",
    Crime: "Crimen",
    Romance: "Romance",
    Animation: "Animación",
    Musical: "Musical"
  };

  
  useEffect(() => {
    if (sessionStorage.getItem("resetGenre") === "1") {
      setSelectedGenre("");
      sessionStorage.removeItem("resetGenre");
    }
  }, [location.pathname]);

 
  useEffect(() => {
    if (!isSidebarOpen) return;

    const btns = document.querySelectorAll(".sidebar-overlay button");
    btns.forEach(btn => btn.blur());
  }, [isSidebarOpen]);

  // Traer películas
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setMessage("");
      try {
        const response = await axiosClient.get('/movies');
        setMovies(response.data);
        if (response.data.length === 0)
          setMessage('No hay películas disponibles actualmente');
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMessage("Error al cargar las películas");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Traer géneros
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axiosClient.get('/genres');
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  // Filtrar películas por género
  const filteredMovies = selectedGenre
    ? movies.filter(movie =>
        movie.genre.some(g => g.genre_name === selectedGenre)
      )
    : movies;

  return (
    <div className="home-container">

      {/* Botón abrir sidebar */}
      {!isSidebarOpen && (
        <button
          className="btn btn-primary filter-toggle"
          onClick={() => setIsSidebarOpen(true)}
        >
          <i className="bi bi-filter me-1"></i> Género
        </button>
      )}

      {/* Sidebar overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5>Filtrar por Género</h5>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => setIsSidebarOpen(false)}
          >
            X
          </button>
        </div>

        <div className="p-3">
          {genres.map((g) => (
            <button
              key={g.genre_id}
              className={`btn btn-sm mb-2 w-100 ${
                selectedGenre === g.genre_name ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => setSelectedGenre(g.genre_name)}
            >
              {genreMap[g.genre_name] || g.genre_name}
            </button>
          ))}

          <button
            className="btn btn-sm mb-2 w-100 btn-outline-secondary"
            onClick={() => setSelectedGenre("")}
          >
            Mostrar Todas
          </button>
        </div>
      </div>

      <div className="movies-content p-3">
        {loading
          ? <h2>Cargando...</h2>
          : <Movies movies={filteredMovies} message={message} />}
      </div>

      {isSidebarOpen && (
        <div className="overlay-bg" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default Home;
