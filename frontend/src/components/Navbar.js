import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fetchFavorites } from "../services/api";
import "./Navbar.css";

function Navbar() {
  const [count, setCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const loadCount = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const data = await fetchFavorites();

      if (data && !data.error) {
        setCount(data.length);
      }
    } catch (err) {
      console.error("Failed to load favorites count:", err);
    }
  };

  useEffect(() => {
    loadCount();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <Link to="/home">
          🎬 Movie Explorer
        </Link>
      </div>

      <div className="navbar-links">

        <Link
          to="/home"
          className={location.pathname === "/home" ? "active" : ""}
        >
          Home
        </Link>

        <Link
          to="/favorites"
          className={location.pathname === "/favorites" ? "active" : ""}
        >
          Favorites ❤️
          <span className="fav-count">
            {count}
          </span>
        </Link>

        <Link
         to="/collections"className={location.pathname === "/collections"? "active" : ""}
         >
          Collections 📁
        </Link>

        <Link
          to="/profile"
          className={location.pathname === "/profile" ? "active" : ""}
        >
          Profile 👤
        </Link>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;