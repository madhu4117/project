import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    const endpoint = isRegister ? "/register" : "/login";

    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          setSuccess("Registration successful! You can now log in.");
          setIsRegister(false);
          setPassword("");
        } else {
          localStorage.setItem("token", data.access_token);
          navigate("/home");
        }
      } else {
        setError(data.detail || "Invalid Email or Password");
      }
    } catch (err) {
      setError("Server connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setSuccess("");
  };

  return (
    <div className="login-container">
      <form className="login-box animate-fade-in" onSubmit={handleLogin}>
        <h1>🎬 Movie Explorer</h1>
        <p>{isRegister ? "Create an account to get started" : "Sign in to continue"}</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
        />

        <button type="submit" disabled={loading}>
          {loading ? (isRegister ? "Registering..." : "Logging In...") : (isRegister ? "Register" : "Login")}
        </button>

        <div className="toggle-mode-container" style={{ marginTop: "20px" }}>
          <button type="button" onClick={toggleMode} className="toggle-mode-btn">
            {isRegister ? "Already have an account? Sign In" : "New here? Create an account"}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;