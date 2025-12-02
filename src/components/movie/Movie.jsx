import { Link } from "react-router-dom";


const Movie = ({ movie }) => {
  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="card-img-top"
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{movie.title}</h5>
          <Link
            to={`/movie/${movie.imdb_id}`}
            className="btn btn-primary w-100 mt-auto"
            style={{ bottom: 0, left: 0, borderRadius: 5, textAlign: "center" }}
          >
            Info Película
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Movie;
