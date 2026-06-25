import React from "react";
import "./CollectionCard.css";

function CollectionCard({ collection, onDelete }) {
  return (
    <div className="collection-card">

      <h2>📁 {collection.name}</h2>

      <p>
        🎬 Movies: {collection.movies?.length || 0}
      </p>

      {collection.movies?.length > 0 && (
        <div className="movie-list">
          {collection.movies.map((movie) => (
            <div key={movie.id} className="movie-item">

              <img
                src={movie.poster}
                alt={movie.movie_title}
                width="120"
              />

              <p>{movie.movie_title}</p>

            </div>
          ))}
        </div>
      )}

      <button
        className="delete-btn"
        onClick={() => onDelete(collection.id)}
      >
        Delete Collection
      </button>

    </div>
  );
}

export default CollectionCard;