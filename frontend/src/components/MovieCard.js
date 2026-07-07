import React from "react";
import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

const MovieCard = ({
  movie,
  addToWishlist,
  onPosterClick,
  handleCompare,
  compareMovies,
}) => {

  const navigate = useNavigate();

  const isSelected = compareMovies?.some(
    (m) => m.imdbID === movie.imdbID
  );

  return (
    <div className="movie-card">

      <div 
        className="movie-poster-container"
        onClick={onPosterClick}
      >
        <img
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/350x500?text=No+Poster"
          }
          alt={movie.Title}
        />

        <div className="poster-overlay">
          🔍 Quick View
        </div>

        <div className="rating-badge">
          ⭐ {movie.imdbRating || "IMDb"}
        </div>

      </div>

      <div className="movie-info">

        <h2 className="movie-title">
          {movie.Title}
        </h2>

        <p className="movie-year">
          {movie.Year}
        </p>

        <div className="button-group">

          <button
            className="wishlist-btn"
            onClick={(e) => {
              e.stopPropagation();
              addToWishlist(movie);
            }}
          >
            ❤️
          </button>

          <button
            className="details-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movie/${movie.imdbID}`);
            }}
          >
            Details
          </button>

        </div>

         <button
  className={`compare-btn ${
    compareMovies?.find(
      (m) => m.imdbID === movie.imdbID
    )
      ? "selected"
      : ""
  }`}
  onClick={() => handleCompare(movie)}
>
  {compareMovies?.find(
    (m) => m.imdbID === movie.imdbID
  ) ? (
    <>
      ✅ Added
    </>
  ) : (
    <>
      ⚖ Compare Movie
    </>
  )}
</button>
        

      </div>

    </div>
  );
};

export default MovieCard;