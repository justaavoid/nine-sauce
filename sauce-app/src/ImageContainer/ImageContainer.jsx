// ImageContainer.jsx
import React from 'react';
import BlurLayerButton from './BlurLayerButton';

const ImageContainer = ({ cellData, revealedImages, rowIndex, revealImage }) => {
  return (
    <div className="image-container">
      <img
        className={`image-id ${revealedImages.includes(rowIndex) ? "revealed" : "blurred"}`}
        src={cellData}
        alt={`Image ${rowIndex}-0`}
      />
      {!revealedImages.includes(rowIndex) && (
        <BlurLayerButton revealImage={() => revealImage(rowIndex)} />
      )}
    </div>
  );
};

export default ImageContainer;
