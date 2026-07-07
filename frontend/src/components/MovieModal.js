import React from "react";
import "./MovieModal.css";

const MovieModal = ({ movie, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="movie-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={closeModal}
        >
          ✕
        </button>

        <div className="modal-left">
          <img
            src={movie.Poster}
            alt={movie.Title}
          />
        </div>

        <div className="modal-right">

          <h1>{movie.Title}</h1>

          <div className="modal-rating">
            ⭐ {movie.imdbRating} / 10
          </div>

          <div className="modal-meta">
            <span>{movie.Year}</span>
            <span>{movie.Runtime}</span>
            <span>{movie.Rated}</span>
          </div>

          <div className="modal-section">
            <h3>Genre</h3>
            <p>{movie.Genre}</p>
          </div>

          <div className="modal-section">
            <h3>Director</h3>
            <p>{movie.Director}</p>
          </div>

          <div className="modal-section">
            <h3>Actors</h3>
            <p>{movie.Actors}</p>
          </div>

          <div className="modal-section">
            <h3>Plot</h3>
            <p>{movie.Plot}</p>
          </div>

          <div className="modal-footer">

            <div className="box">
              <span>Language</span>
              <strong>{movie.Language}</strong>
            </div>

            <div className="box">
              <span>Country</span>
              <strong>{movie.Country}</strong>
            </div>

            <div className="box">
              <span>Awards</span>
              <strong>{movie.Awards}</strong>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default MovieModal;