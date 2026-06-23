import React from "react";
import "./MovieModal.css";

const MovieModal = ({
  movie,
  closeModal,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">

        <button
          className="close-btn"
          onClick={closeModal}
        >
          X
        </button>

        <img
          src={movie.Poster}
          alt={movie.Title}
        />

        <div className="modal-content">
          <h2>{movie.Title}</h2>

          <p><strong>Genre:</strong> {movie.Genre}</p>

          <p><strong>IMDB:</strong> ⭐ {movie.imdbRating}</p>

          <p>{movie.Plot}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;