import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchFavorites } from "../services/api";
import "./Navbar.css";

function Navbar() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await fetchFavorites();

      if (data && !data.error) {
        setCount(data.length);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">

      <NavLink to="/home" className="navbar-logo">
        🎬
        <span>Movie Explorer</span>
      </NavLink>

      <div className="navbar-links">

        <NavLink to="/home">
          Home
        </NavLink>

        <NavLink to="/favorites">
          Favorites

          {count > 0 && (
            <span className="fav-count">
              {count}
            </span>
          )}
        </NavLink>

        <NavLink to="/collections">
          Collections
        </NavLink>

        <NavLink to="/profile">
          Profile
        </NavLink>

      </div>

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>

    </nav>
  );
}

export default Navbar;