import React, { useState } from "react";
import "./uploads.css";

function UploadForm() {
  const [formData, setFormData] = useState({
    picture: "",
    image_link: "",
    idName: "",
    isSensitive: false,
    waitTime: 5,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const picture = formData.get("picture");
    const image_link = formData.get("image_link");
    const idName = formData.get("idName");
    const isSensitive = formData.get("isSensitive") === "on";
    const waitTime = formData.get("waitTime");

    // You can also update state if needed
    setFormData({
      ...formData,
      picture,
      image_link,
      idName,
      isSensitive,
      waitTime,
    });

    try {
      // Upload image to Cloudinary
      const cloudinaryResponse = await uploadImageToCloudinary(picture);
      const cloudinaryImageUrl = cloudinaryResponse.secure_url;

      // Update Google Sheet with Cloudinary image URL and form data
      await addRowToGoogleSheet(
        cloudinaryImageUrl,
        image_link,
        idName,
        isSensitive ? 1 : 0,
        waitTime
      );

      // Show success notification
      const errorMsg = document.getElementById("error-mul-image");
      errorMsg.innerText =
        "Image uploaded successfully with URL: " + cloudinaryImageUrl;
      errorMsg.style.color = "green";

      // Optionally, you can reset the form after submission
      form.reset();
    } catch (error) {
      // Show error notification
      const errorMsg = document.getElementById("error-mul-image");
      errorMsg.innerText = "Failed to upload image or update Google Sheet";
      errorMsg.style.color = "red";
      console.error("Error:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const uploadImageToCloudinary = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "sauce-app-image");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/info-vibes/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const cloudinaryResponse = await response.json();
        const cloudinaryImageUrl = cloudinaryResponse.secure_url;

        // Show notification
        const errorMsg = document.getElementById("error-mul-image");
        errorMsg.innerText =
          "Image uploaded successfully with url \n " + cloudinaryImageUrl;
        errorMsg.style.color = "green";

        // Return Cloudinary response
        return cloudinaryResponse;
      } else {
        throw new Error("Failed to upload image to Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      // Show error notification
      const errorMsg = document.getElementById("error-mul-image");
      errorMsg.innerText = "Failed to upload image to Cloudinary";
      errorMsg.style.color = "red";
      throw error;
    }
  };

  const addRowToGoogleSheet = async (
    cloudinaryImageUrl,
    imageUrl,
    idName,
    isSen,
    waitTime
  ) => {
    try {
      // Construct the URL for adding a new row to SheetDB
      const sheetDbUrl = "https://sheetdb.io/api/v1/jk4d8jbl4buc1";

      // Construct the headers with Bearer token for authentication
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer k8dxrk9ucybgoygst69n3t6vwm1eqbq9uodc9zmd",
      };

      const data = [
        {
          "img-url": cloudinaryImageUrl,
          "info-url": imageUrl,
          "code-name": idName,
          "is-sen": isSen,
          "wait-time": waitTime,
        },
      ];

      // Send a POST request to add the new row with the data and authentication
      const response = await fetch(sheetDbUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      // Check if the request was successful
      if (response.ok) {
        console.log("New row added successfully to SheetDB");
      } else {
        throw new Error("Failed to add new row to SheetDB");
      }
    } catch (error) {
      console.error("Error adding new row to SheetDB:", error);
      throw error;
    }
  };

  return (
    <div>
      <h1>Image Uploads Cloudinary</h1>
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <hr />
        <div>
          <label htmlFor="picture">Select picture</label>
          <div className="file-container">
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              onChange={handleInputChange}
            />
            <button
              className="clear-file"
              type="button"
              onClick={() => {
                document.getElementById("picture").value = "";
              }}
            >
              &#10060;
            </button>
          </div>
          <span className="error-msg" id="error-mul-image"></span>
        </div>

        <div className="section"></div>
        <hr />
        <div className=".search-link">
          <label htmlFor="image_link">Search Link</label>
          <textarea
            className="qr"
            id="image_link"
            name="image_link"
            placeholder="Enter search link"
            rows="5"
            onChange={handleInputChange}
            value={formData.image_link}
          ></textarea>
          <br />
          <span className="error-msg" id="error-qr-img"></span>
        </div>
        <div className="section"></div>
        <hr />
        <div className="idNum">
          <label htmlFor="idName">ID</label>
          <input name="idName" type="text" />
        </div>
        <hr />
        <div className="isSensitive">
          <label htmlFor="isSensitive">isSen</label>
          <input name="isSensitive" type="checkbox" />
        </div>
        <hr />
        <div className="wait-time">
          <label htmlFor="waitTime">Wait time</label>
          <input name="waitTime" type="number" />
        </div>
        <hr />
        <div className="buttons">
          <button className="btn" type="submit">
            Uploads
          </button>
          <a href="/" className="btn">
            Home
          </a>
        </div>
      </form>
    </div>
  );
}

export default UploadForm;
