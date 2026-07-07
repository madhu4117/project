import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchMovieDetails } from "../services/api";
import "./CompareMovies.css";

const CompareMovies = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const movies = location.state || [];

  const [movie1, setMovie1] = useState(null);
  const [movie2, setMovie2] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      if (movies.length < 2) return;

      try {
        const m1 = await fetchMovieDetails(movies[0].imdbID);
        const m2 = await fetchMovieDetails(movies[1].imdbID);

        // Temporary values until backend compare API is created
        m1.userRating = 4.6;
        m1.totalReviews = 180;

        m2.userRating = 4.2;
        m2.totalReviews = 120;

        setMovie1(m1);
        setMovie2(m2);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    loadMovies();
  }, []);

  if (movies.length < 2) {
    return (
      <div className="compare-page">
        <div className="empty-compare">
          <h1>⚖ Compare Movies</h1>

          <p>Select two movies first.</p>

          <button onClick={() => navigate("/home")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (loading || !movie1 || !movie2) {
    return <h2 className="loading">Loading...</h2>;
  }

  const imdbWinner =
    parseFloat(movie1.imdbRating) >
    parseFloat(movie2.imdbRating)
      ? movie1.Title
      : movie2.Title;

  const userWinner =
    movie1.userRating > movie2.userRating
      ? movie1.Title
      : movie2.Title;

  const reviewWinner =
    movie1.totalReviews > movie2.totalReviews
      ? movie1.Title
      : movie2.Title;

  
    return (
  <div className="compare-page">

    <h1 className="compare-title">
      ⚖ Compare Movies
    </h1>

    <div className="compare-container">

      {/* Movie 1 */}

      <div className="compare-card">

        <img
          src={movie1.Poster}
          alt={movie1.Title}
          className="compare-poster"
        />

        <h2>{movie1.Title}</h2>

        <div className="rating-grid">

          <div className={`rating-box ${imdbWinner === movie1.Title ? "winner-box" : ""}`}>
            <h4>⭐ IMDb</h4>
            <span>{movie1.imdbRating}</span>
          </div>

          <div className={`rating-box ${userWinner === movie1.Title ? "winner-box" : ""}`}>
            <h4>❤️ User</h4>
            <span>{movie1.userRating}</span>
          </div>

          <div className={`rating-box ${reviewWinner === movie1.Title ? "winner-box" : ""}`}>
            <h4>📝 Reviews</h4>
            <span>{movie1.totalReviews}</span>
          </div>

        </div>

        <div className="compare-info">

          <p><strong>📅 Year</strong><span>{movie1.Year}</span></p>

          <p><strong>🎭 Genre</strong><span>{movie1.Genre}</span></p>

          <p><strong>⏱ Runtime</strong><span>{movie1.Runtime}</span></p>

          <p><strong>🎬 Director</strong><span>{movie1.Director}</span></p>

          <p><strong>👥 Cast</strong><span>{movie1.Actors}</span></p>

        </div>

        <div className="plot-box">

          <h3>📝 Plot</h3>

          <p>{movie1.Plot}</p>

        </div>

      </div>

      <div className="vs-circle">

        

      </div>

      {/* Movie 2 */}

      <div className="compare-card">

        <img
          src={movie2.Poster}
          alt={movie2.Title}
          className="compare-poster"
        />

        <h2>{movie2.Title}</h2>

        <div className="rating-grid">

          <div className={`rating-box ${imdbWinner === movie2.Title ? "winner-box" : ""}`}>
            <h4>⭐ IMDb</h4>
            <span>{movie2.imdbRating}</span>
          </div>

          <div className={`rating-box ${userWinner === movie2.Title ? "winner-box" : ""}`}>
            <h4>❤️ User</h4>
            <span>{movie2.userRating}</span>
          </div>

          <div className={`rating-box ${reviewWinner === movie2.Title ? "winner-box" : ""}`}>
            <h4>📝 Reviews</h4>
            <span>{movie2.totalReviews}</span>
          </div>

        </div>

        <div className="compare-info">

          <p><strong>📅 Year</strong><span>{movie2.Year}</span></p>

          <p><strong>🎭 Genre</strong><span>{movie2.Genre}</span></p>

          <p><strong>⏱ Runtime</strong><span>{movie2.Runtime}</span></p>

          <p><strong>🎬 Director</strong><span>{movie2.Director}</span></p>

          <p><strong>👥 Cast</strong><span>{movie2.Actors}</span></p>

        </div>

        <div className="plot-box">

          <h3>📝 Plot</h3>

          <p>{movie2.Plot}</p>

        </div>

      </div>

    </div>

    <div className="compare-summary">

      <h2>🏆 Comparison Summary</h2>

      <p>✔ <strong>{imdbWinner}</strong> has the higher IMDb Rating.</p>

      <p>✔ <strong>{userWinner}</strong> has the higher User Rating.</p>

      <p>✔ <strong>{reviewWinner}</strong> has more Reviews.</p>

      <div className="recommended">

        ⭐ Recommended Movie

        <h3>{imdbWinner}</h3>

      </div>

      <button
        className="compare-back-btn"
        onClick={() => navigate("/home")}
      >
        ← Compare Other Movies
      </button>

    </div>

  </div>
);

};

export default CompareMovies;