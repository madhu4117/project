import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, getAuthHeaders } from "../services/api";
import "./Collections.css";
import CollectionCard from "../components/CollectionCard";

function Collections() {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/collections`,
        getAuthHeaders()
      );

      setCollections(response.data);

    } catch (err) {
      console.error(err);
    }
  };

  const createCollection = async () => {
    if (!name.trim()) return;

    try {
      await axios.post(
        `${BASE_URL}/collections`,
        {
          name,
          description
        },
        getAuthHeaders()
      );

      setName("");
      setDescription("");

      loadCollections();

    } catch (err) {
      console.error(err);
    }
  };

  const deleteCollection = async (id) => {
    try {
      await axios.delete(
        `${BASE_URL}/collections/${id}`,
        getAuthHeaders()
      );

      loadCollections();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="collections-container">

      <h1>🎬 My Collections</h1>

      <div className="create-card">

        <input
          type="text"
          placeholder="Collection Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button onClick={createCollection}>
          Create Collection
        </button>

      </div>

      <div className="collections-grid">

        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            onDelete={deleteCollection}
          />
        ))}

      </div>

    </div>
  );
}

export default Collections;