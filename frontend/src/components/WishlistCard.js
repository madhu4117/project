import React from "react";

const WishlistCard = ({ movie, removeFromWishlist }) => {
  return (
    <div className="wishlist-card">

      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x450?text=No+Poster"
        }
        alt={movie.Title}
      />

      <div className="wishlist-info">

        <h3>{movie.Title}</h3>

        <p className="wishlist-year">
          {movie.Year}
        </p>

        <button
          className="remove-btn"
          onClick={() => removeFromWishlist(movie.imdbID)}
        >
          🗑 Remove
        </button>

      </div>

    </div>
  );
};

export default WishlistCard;