// BlurLayerButton.jsx
import React from 'react';

const BlurLayerButton = ({ revealImage, rowIndex }) => {
  return (
    <div className="blur-layer">
      <p>⚠️ Sensitive Content</p>
      <button
        className="reveal-button"
        onClick={() => revealImage(rowIndex)}
      >
        👁️ view
      </button>
    </div>
  );
};

export default BlurLayerButton;
