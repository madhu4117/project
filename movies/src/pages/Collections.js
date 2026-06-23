import React, { useEffect, useState } from "react";
import axios from "axios";
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
        "http://127.0.0.1:8000/collections"
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
        "http://127.0.0.1:8000/collections",
        {
          name,
          description
        }
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
        `http://127.0.0.1:8000/collections/${id}`
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