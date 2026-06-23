import React, { useEffect, useState } from "react";
import axios from "axios";
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
        "http://127.0.0.1:8000/profile/"
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
        "http://127.0.0.1:8000/profile/",
        {
          name,
          email
        }
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
        "http://127.0.0.1:8000/profile/change-password",
        {
          old_password: oldPassword,
          new_password: newPassword
        }
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