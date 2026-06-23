import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const statsResponse = await axios.get(
        "http://127.0.0.1:8000/admin/stats"
      );

      const usersResponse = await axios.get(
        "http://127.0.0.1:8000/admin/users"
      );

      const reviewsResponse = await axios.get(
        "http://127.0.0.1:8000/admin/reviews"
      );

      setStats(statsResponse.data);
      setUsers(usersResponse.data);
      setReviews(reviewsResponse.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/admin/reviews/${id}`
      );

      setReviews(
        reviews.filter(
          (review) => review.id !== id
        )
      );

      alert("Review deleted successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">

      <h1 className="title">
        📊 Admin Dashboard
      </h1>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <h2>{stats.total_users}</h2>
          <p>Total Users</p>
        </div>

        <div className="stat-card">
          <h2>{stats.total_reviews}</h2>
          <p>Total Reviews</p>
        </div>

        <div className="stat-card">
          <h2>{stats.total_favorites}</h2>
          <p>Total Favorites</p>
        </div>

        <div className="stat-card">
          <h2>{stats.most_searched_movie}</h2>
          <p>Most Searched Movie</p>
        </div>

      </div>

      {/* Users */}
      <div className="section">

        <h2>👥 Users</h2>

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* Reviews */}
      <div className="section">

        <h2>🛡️ Review Moderation</h2>

        {reviews.map((review) => (

          <div
            className="review-card"
            key={review.id}
          >

            <p>
              <strong>Movie ID:</strong>
              {" "}
              {review.movie_id}
            </p>

            <p>
              <strong>Rating:</strong>
              {" "}
              ⭐ {review.rating}
            </p>

            <p>
              {review.comments}
            </p>

            <button
              className="delete-btn"
              onClick={() => deleteReview(review.id)}
            >
              Delete Review
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AdminDashboard;