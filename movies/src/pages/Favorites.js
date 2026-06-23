import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFavorites, removeFavorite } from "../services/api";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      loadFavorites();
    }
  }, [navigate]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchFavorites();
      if (data && !data.error) {
        const mapped = data.map(fav => ({
          imdbID: fav.movie_id,
          Title: fav.title,
          Poster: fav.poster
        }));
        setFavorites(mapped);
      } else if (data && data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to load favorites. Is the server running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (id) => {
    try {
      const response = await removeFavorite(id);
      if (response && response.message === "Removed from favorites") {
        setFavorites(prev => prev.filter(movie => movie.imdbID !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Error removing from favorites");
    }
  };

  return (
    <div className="app animate-fade-in">
      <div className="home-header">
        <h1>❤️ Your Favorites</h1>
        <p className="subtitle">Your curated selection of must-watch cinema</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <h2>Loading favorites...</h2>
        </div>
      ) : error ? (
        <h2 className="error-text">{error}</h2>
      ) : favorites.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <h3>No Favorites Added Yet</h3>
          <p>Go back to home and explore movies to add to your list.</p>
        </div>
      ) : (
        <div className="movie-container">
          {favorites.map((movie) => (
            <div
              className="movie-card animate-fade-in"
              key={movie.imdbID}
            >
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/350x500?text=No+Poster"}
                alt={movie.Title}
              />
              <div className="movie-info">
                <h2>{movie.Title}</h2>
                <div className="button-group" style={{ marginTop: "15px" }}>
                  <button
                    className="wishlist-btn"
                    style={{ background: "#ef4444" }}
                    onClick={() => handleRemoveFavorite(movie.imdbID)}
                  >
                    Remove ❌
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;