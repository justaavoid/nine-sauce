/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import "./ImageContainer.css";
const ImageContainer = ({ cellData, revealedImages, rowIndex }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  return (
    <div className="img-bx">
      <img
        className={`image-id ${
          revealedImages.includes(rowIndex) ? "revealed" : "blurred"
        }`}
        src={cellData}
        alt={`Image ${rowIndex}-0`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageLoaded ? "inline-block" : "none" }}
      />

      {!imageLoaded && <img src={`404 image not found`} alt={"Error image"} />}
    </div>
  );
};

export default ImageContainer;
