import React from "react";
import "./style.css";

const Result = ({ imageLink, cloudinaryImageUrl }) => {
  return (
    <div className=".container">
      <h2>Lastest Uploaded Image Details</h2>
      <div>
        <p>
          <strong>INFO:</strong> {imageLink}
        </p>
      </div>
      <div className="img-show">
        <img src={cloudinaryImageUrl} alt="Uploaded" width={200} height={200} />
      </div>
    </div>
  );
};

export default Result;
