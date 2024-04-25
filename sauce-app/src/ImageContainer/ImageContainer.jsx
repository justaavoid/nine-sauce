import React, { useState } from "react";
import "./BlurLayer.css";
import BlurLayerButton from "./BlurLayerButton";

const ImageContainer = ({
  cellData,
  revealedImages,
  rowIndex,
  revealImage,
  codetimeData,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  return (
    <div className="image-container">
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
      {imageLoaded && !revealedImages.includes(rowIndex) && (
        <>
          {!showModal && (
            <BlurLayerButton
              revealImage={() => {
                setShowModal(true);
              }}
            />
          )}
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <p className="warning-content">
                  ⚠️ This content is potentially sensitive and is intended for
                  individuals aged 18 years or older.
                </p>
                <div className="confirm-group">
                  <button
                    className="close cancel-button"
                    onClick={handleCloseModal}
                  >
                    &times;
                  </button>
                  <button
                    className="confirm-button"
                    onClick={() => {
                      revealImage(rowIndex);
                      setShowModal(false);
                    }}
                  >
                    I'm 18 or older
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {!imageLoaded && <img src={`404 image not found`} alt={"Error image"} />}
      <div>
        <p className="code-update-time" color="black">
          ID [ {codetimeData}]
        </p>
      </div>
    </div>
  );
};

export default ImageContainer;
