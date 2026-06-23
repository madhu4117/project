import React from "react";
import "./SkeletonCard.css";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shim"></div>
      <div className="skeleton-info">
        <div className="skeleton-title shim"></div>
        <div className="skeleton-text shim"></div>
        <div className="skeleton-buttons">
          <div className="skeleton-button shim"></div>
          <div className="skeleton-button shim"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
