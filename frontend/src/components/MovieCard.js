import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({
  movie,
  addToWishlist,
  onPosterClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="movie-card animate-fade-in">
      <div className="movie-poster-container" onClick={onPosterClick} style={{ cursor: "pointer" }}>
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/350x500?text=No+Poster"}
          alt={movie.Title}
        />
        <div className="poster-overlay">
          <span>🔍 Quick View</span>
        </div>
      </div>

      <div className="movie-info">
        <h2 onClick={onPosterClick} style={{ cursor: "pointer" }} className="movie-card-title">
          {movie.Title}
        </h2>

        <p className="movie-card-year">{movie.Year}</p>

        <div className="button-group">
          <button
            className="wishlist-btn"
            onClick={() => addToWishlist(movie)}
          >
            ❤️ Favorite
          </button>

          <button
            className="details-btn"
            onClick={() => navigate(`/movie/${movie.imdbID}`)}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;