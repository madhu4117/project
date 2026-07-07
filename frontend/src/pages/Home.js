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
import AnimatedBackground from "../components/AnimatedBackground";

import {
  fetchMovies,
  fetchFavorites,
  addFavorite,
  removeFavorite,
  fetchMovieDetails,
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

  // Compare Movies
  const [compareMovies, setCompareMovies] = useState([]);

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

        const mapped = data.map((fav) => ({
          imdbID: fav.movie_id,
          Title: fav.title,
          Poster: fav.poster,
        }));

        setWishlist(mapped);

      }

    } catch (err) {

      console.error(err);

    }

  };

  const getMovies = async () => {

    if (!searchTerm.trim()) {

      setError("Please enter a movie title.");

      setMovies([]);

      return;
    }

    try {

      setLoading(true);

      setError("");

      const data = await fetchMovies(
        searchTerm,
        page
      );

      if (data.Response === "True") {

        setMovies(data.Search);

      } else {

        setError(data.Error);

        setMovies([]);

      }

    } catch (err) {

      setError("Something went wrong.");

      setMovies([]);

    } finally {

      setLoading(false);

    }

  };

  const addToWishlist = async (movie) => {

    const exists = wishlist.find(
      (m) => m.imdbID === movie.imdbID
    );

    if (exists) {

      alert("Already in Favorites ❤️");

      return;

    }

    try {

      const mappedFav = {

        movie_id: movie.imdbID,

        title: movie.Title,

        poster: movie.Poster,

      };

      const response = await addFavorite(mappedFav);

      if (response.message === "Added to favorites") {

        setWishlist((prev) => [...prev, movie]);

      }

    } catch (err) {

      console.error(err);

    }

  };

  const removeFromWishlist = async (id) => {

    try {

      const response = await removeFavorite(id);

      if (response.message === "Removed from favorites") {

        setWishlist((prev) =>
          prev.filter((m) => m.imdbID !== id)
        );

      }

    } catch (err) {

      console.error(err);

    }

  };

  const handleOpenModal = async (movie) => {

    try {

      const details = await fetchMovieDetails(
        movie.imdbID
      );

      if (details) {

        setSelectedMovie(details);

      }

    } catch (err) {

      console.error(err);

    }

  };

  // ==========================
  // Compare Movies
  // ==========================

  const handleCompare = (movie) => {

    const exists = compareMovies.find(
      (m) => m.imdbID === movie.imdbID
    );

    if (exists) {

      setCompareMovies(
        compareMovies.filter(
          (m) => m.imdbID !== movie.imdbID
        )
      );

      return;

    }

    if (compareMovies.length >= 2) {

      alert("You can compare only 2 movies.");

      return;

    }

    setCompareMovies([
      ...compareMovies,
      movie,
    ]);
  };

  return (

    <div className="app">

      <AnimatedBackground />

      {/* Hero Section */}
    <section className="hero">

  <div className="hero-content">

    <h1 className="hero-title">
      Discover,
      <span> explore </span>
      and organize
      <br />
      your
      <span> favorite cinema</span>
    </h1>

    <p className="hero-subtitle">
      Search for movies, add favorites and build your collections.
    </p>

    <div className="search-wrapper">

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

    </div>

  </div>

</section>

{/* ===========================
    MOVIES SECTION
=========================== */}

<section className="movies-section">

  <div className="section-header">

    <h2>🎬 Explore Movies</h2>

  </div>

  {/* Compare Button */}

  {compareMovies.length > 0 && (

    <div className="compare-bar">

      <button
        className="compare-page-btn"
        disabled={compareMovies.length < 2}
        onClick={() =>
          navigate("/compare", {
            state: compareMovies,
          })
        }
      >
        ⚖ Compare Movies ({compareMovies.length}/2)
      </button>

    </div>

  )}

  {loading ? (

    <div className="movie-container">

      {[...Array(8)].map((_, index) => (

        <SkeletonCard key={index} />

      ))}

    </div>

  ) : (

    <>

      {error && (

        <h2 className="error-text">

          {error}

        </h2>

      )}

      <div className="movie-container">

        {movies.map((movie) => (

          <MovieCard
            key={movie.imdbID}
            movie={movie}
            addToWishlist={addToWishlist}
            onPosterClick={() =>
              handleOpenModal(movie)
            }
            handleCompare={handleCompare}
            compareMovies={compareMovies}
          />

        ))}

      </div>

    </>

  )}

</section>
{/* ===========================
    PAGINATION
=========================== */}

{movies.length > 0 && !loading && (

  <div className="pagination">

    <button
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
    >
      ← Previous
    </button>

    <span className="page-number">
      {page}
    </span>

    <button
      onClick={() => setPage(page + 1)}
    >
      Next →
    </button>

  </div>

)}

{/* ===========================
    FAVORITES
=========================== */}

<section className="wishlist-section">

  <div className="section-header">

    <h2>
      ❤️ Your Favorites
    </h2>

  </div>

  {wishlist.length === 0 ? (

    <div className="empty-state">

      <h3>No Favorites Yet</h3>

      <p>
        Add movies to your favorites.
      </p>

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

</section>

{/* ===========================
    MOVIE MODAL
=========================== */}

{selectedMovie && (

  <MovieModal
    movie={selectedMovie}
    closeModal={() =>
      setSelectedMovie(null)
    }
  />

)}

</div>

);

};

export default Home;  