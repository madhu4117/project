import axios from "axios";

export const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const fetchMovies = async (searchTerm, page = 1) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movies/search?title=${searchTerm}&page=${page}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("fetchMovies error:", error);
    throw error;
  }
};

export const fetchMovieDetails = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movies/${id}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("fetchMovieDetails error:", error);
    throw error;
  }
};

export const fetchFavorites = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/favorites`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("fetchFavorites error:", error);
    throw error;
  }
};

export const addFavorite = async (movie) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/favorites`,
      movie,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("addFavorite error:", error);
    throw error;
  }
};

export const removeFavorite = async (movieId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/favorites/${movieId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("removeFavorite error:", error);
    throw error;
  }
};