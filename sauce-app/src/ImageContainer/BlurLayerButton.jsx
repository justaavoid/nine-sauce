// BlurLayerButton.jsx
import React from "react";

const BlurLayerButton = ({ revealImage, rowIndex }) => {
  return (
    <div>
      <div className="blur-layer">
        <p className="sensitive-content">⚠️ Sensitive Content</p>
        <button className="reveal-button" onClick={() => revealImage(rowIndex)}>
          👁️ view
        </button>
      </div>
    </div>
  );
};

export default BlurLayerButton;
