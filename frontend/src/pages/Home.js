import React, {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import WishlistCard from "../components/WishlistCard";
import SkeletonCard from "../components/SkeletonCard";
import MovieModal from "../components/MovieModal";

import {
  fetchMovies,
  fetchFavorites,
  addFavorite,
  removeFavorite,
  fetchMovieDetails
} from "../services/api";

import "./Home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("Batman");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      loadFavorites();
    }
  }, [navigate]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getMovies();
    }
  }, [searchTerm, page]);

  const loadFavorites = async () => {
    try {
      const data = await fetchFavorites();
      if (data && !data.error) {
        const mapped = data.map(fav => ({
          imdbID: fav.movie_id,
          Title: fav.title,
          Poster: fav.poster
        }));
        setWishlist(mapped);
      }
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  };

  const getMovies = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a movie title to search.");
      setMovies([]);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await fetchMovies(searchTerm, page);

      if (data.Response === "True") {
        setMovies(data.Search);
        setError("");
      } else {
        setError(data.Error || "No results found");
        setMovies([]);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (movie) => {
    const exists = wishlist.find(
      (item) => item.imdbID === movie.imdbID
    );

    if (exists) {
      alert("Already in Favorites ❤️");
      return;
    }

    try {
      const mappedFav = {
        movie_id: movie.imdbID,
        title: movie.Title,
        poster: movie.Poster
      };
      const response = await addFavorite(mappedFav);
      if (response && response.message === "Added to favorites") {
        setWishlist(prev => [...prev, movie]);
        alert("Added to Favorites ❤️");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding to favorites");
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const response = await removeFavorite(id);
      if (response && response.message === "Removed from favorites") {
        setWishlist(prev => prev.filter(movie => movie.imdbID !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Error removing from favorites");
    }
  };

  const handleOpenModal = async (movie) => {
    try {
      const details = await fetchMovieDetails(movie.imdbID);
      if (details) {
        setSelectedMovie(details);
      }
    } catch (err) {
      console.error("Failed to load details:", err);
      alert("Could not load movie details");
    }
  };

  return (
    <div className="app">
      <div className="home-header">
        <h1>🎬 Movie Explorer</h1>
        <p className="subtitle">Discover, explore and organize your favorite cinema</p>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {loading ? (
        <div className="movie-container">
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <>
          {error && (
            <h2 className="error-text animate-fade-in">
              {error}
            </h2>
          )}

          <div className="movie-container">
            {movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                addToWishlist={addToWishlist}
                onPosterClick={() => handleOpenModal(movie)}
              />
            ))}
          </div>
        </>
      )}

      {movies.length > 0 && !loading && (
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}

      <div className="wishlist-section">
        <h2>❤️ Favorites ({wishlist.length})</h2>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <h3>No Favorites Yet</h3>
            <p>Add movies to your favorites to see them here.</p>
          </div>
        ) : (
          <div className="wishlist-container">
            {wishlist.map((movie) => (
              <WishlistCard
                key={movie.imdbID}
                movie={movie}
                removeFromWishlist={removeFromWishlist}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          closeModal={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Home;