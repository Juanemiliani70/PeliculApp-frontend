import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Card className="bg-dark text-light h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={movie.image}
        alt={movie.title}
        style={{ height: '350px', objectFit: 'cover' }}
      />

      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>

        {movie.genre && (
          <Card.Text className="text-info">
            {movie.genre}
          </Card.Text>
        )}

        <Button
          as={Link}
          to={`/movie/${movie.imdb_id}`}
          variant="info"
          className="w-100 mt-2"
        >
          Ver más
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
