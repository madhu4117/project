import React from "react";

function WishlistCard({
  movie,
  removeFromWishlist,
}) {
  return (
    <div className="wishlist-card">
      <img
        src={movie.Poster}
        alt={movie.Title}
      />

      <h3>{movie.Title}</h3>

<p>📅 {movie.Year}</p>

      <button
        className="remove-btn"
        onClick={() =>
          removeFromWishlist(
            movie.imdbID
          )
        }
      >
        ❌ Remove
      </button>
    </div>
  );
}

export default WishlistCard;