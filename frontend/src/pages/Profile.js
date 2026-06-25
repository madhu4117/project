import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, getAuthHeaders } from "../services/api";
import "./Profile.css";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/profile/`,
        getAuthHeaders()
      );

      setName(response.data.name || "");
      setEmail(response.data.email);
    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
    }
  };

  const updateProfile = async () => {
    try {
      await axios.put(
        `${BASE_URL}/profile/`,
        {
          name,
          email
        },
        getAuthHeaders()
      );

      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Unable to update profile");
    }
  };

  const changePassword = async () => {
    try {
      await axios.put(
        `${BASE_URL}/profile/change-password`,
        {
          old_password: oldPassword,
          new_password: newPassword
        },
        getAuthHeaders()
      );

      alert("Password changed successfully");

      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      alert("Old password incorrect");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">

        <h1>👤 My Profile</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={updateProfile}>
          Save Changes
        </button>

        <h2>🔒 Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={changePassword}>
          Change Password
        </button>

      </div>
    </div>
  );
}

export default Profile;