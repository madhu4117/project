import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchMovieDetails, BASE_URL, getAuthHeaders } from "../services/api";
import "./MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");

  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    loadData();
    loadCollections();
  }, [id, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);

      const movieData = await fetchMovieDetails(id);

      if (movieData && !movieData.error) {
        setMovie(movieData);
      }

      const reviewsResponse = await axios.get(
        `${BASE_URL}/reviews/${id}`,
        getAuthHeaders()
      );

      setReviews(reviewsResponse.data);

      const avgResponse = await axios.get(
        `${BASE_URL}/reviews/${id}/average`,
        getAuthHeaders()
      );

      setAverageRating(avgResponse.data.average_rating);
    } catch (err) {
      console.error(err);
      setError("Error loading movie details");
    } finally {
      setLoading(false);
    }
  };

  const loadCollections = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/collections/`,
        getAuthHeaders()
      );

      setCollections(response.data);

      if (response.data.length > 0) {
        setSelectedCollection(response.data[0].id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addToCollection = async () => {
    if (!selectedCollection) {
      alert("Please create a collection first.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/collections/${selectedCollection}/movies`,
        {
          movie_id: id,
          movie_title: movie.Title,
          poster: movie.Poster
        },
        getAuthHeaders()
      );

      alert("Movie added to collection successfully!");
    } catch (error) {
      console.log(error);
      alert("Movie already exists in this collection.");
    }
  };

  const submitReview = async () => {
    try {
      await axios.post(
        `${BASE_URL}/reviews/`,
        {
          movie_id: id,
          rating: rating,
          comments: comments,
        },
        getAuthHeaders()
      );

      setComments("");
      setRating(5);

      loadData();

      alert("Review added successfully!");
    } catch (error) {
      alert("You have already reviewed this movie.");
    }
  };

  if (loading) {
    return (
      <div className="details-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="details-container">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="details-container">

      <button
        className="back-btn"
        onClick={() => navigate("/home")}
      >
        ← Back
      </button>

      <div className="details-card">

        <img
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/320x480"
          }
          alt={movie.Title}
        />

        <div className="details-info">

          <h1>{movie.Title}</h1>

          <p>
            <strong>Year:</strong> {movie.Year}
          </p>

          <p>
            <strong>Genre:</strong> {movie.Genre}
          </p>

          <p>
            <strong>IMDb Rating:</strong> ⭐ {movie.imdbRating}
          </p>

          <p>
            <strong>Plot:</strong>
          </p>

          <p>{movie.Plot}</p>

          {/* Add To Collection */}
          <div style={{ marginTop: "20px" }}>
            <h3>📁 Add To Collection</h3>

            <select
              value={selectedCollection}
              onChange={(e) =>
                setSelectedCollection(e.target.value)
              }
            >
              {collections.map((collection) => (
                <option
                  key={collection.id}
                  value={collection.id}
                >
                  {collection.name}
                </option>
              ))}
            </select>

            <button
              className="submit-btn"
              onClick={addToCollection}
              style={{ marginLeft: "10px" }}
            >
              Add Movie
            </button>
          </div>

          <div className="reviews-section">

            <h2>⭐ Ratings & Reviews</h2>

            <div className="average-rating">
              ⭐ {averageRating} ({reviews.length} Reviews)
            </div>

            <div className="review-form">

              <h3>Write a Review</h3>

              <select
                className="rating-select"
                value={rating}
                onChange={(e) =>
                  setRating(Number(e.target.value))
                }
              >
                <option value={5}>★★★★★</option>
                <option value={4}>★★★★</option>
                <option value={3}>★★★</option>
                <option value={2}>★★</option>
                <option value={1}>★</option>
              </select>

              <textarea
                rows="4"
                className="review-text"
                placeholder="Write your review..."
                value={comments}
                onChange={(e) =>
                  setComments(e.target.value)
                }
              />

              <button
                className="submit-btn"
                onClick={submitReview}
              >
                Submit Review
              </button>

            </div>

            <div className="reviews-list">

              {reviews.length === 0 ? (
                <p>Start rating this movie and share your thoughts.</p>
              ) : (
                reviews.map((review) => (
                  <div
                    className="review-card"
                    key={review.id}
                  >
                    <h4>User {review.user_id}</h4>

                    <div className="stars">
                      {"★".repeat(review.rating)}
                    </div>

                    <p>{review.comments}</p>
                  </div>
                ))
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MovieDetails;