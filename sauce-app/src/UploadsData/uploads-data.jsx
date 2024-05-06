import React from "react";

function UploadForm() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const imageFile = formData.get("picture");
    const imageUrl = formData.get("image_link");

    try {
      const cloudinaryResponse = await uploadImageToCloudinary(imageFile);
      const cloudinaryImageUrl = cloudinaryResponse.secure_url;

      await updateGoogleSheetWithUrls(cloudinaryImageUrl, imageUrl);

      console.log("Image uploaded to Cloudinary:", cloudinaryImageUrl);
      console.log("QR URL added to Google Sheets:", imageUrl);
    } catch (error) {
      console.error("Error processing form:", error);
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
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
    return await response.json();
  };

  const updateGoogleSheetWithUrls = async (cloudinaryImageUrl, imageUrl) => {
    try {
      const GOOGLE_SHEETS_API_ENDPOINT = "YOUR_GOOGLE_SHEETS_API_ENDPOINT";
      const response = await fetch(GOOGLE_SHEETS_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cloudinaryImageUrl,
          imageUrl,
        }),
      });
      const data = await response.json();
      console.log("Google Sheets updated successfully:", data);
    } catch (error) {
      console.error("Error updating Google Sheets:", error);
      throw error;
    }
  };

  return (
    <div>
      <h1>Image Processing Page</h1>
      <form
        action="/process-image"
        method="post"
        enctype="multipart/form-data"
        onsubmit="return validateForm()"
        onSubmit={handleSubmit}
      >
        <hr />
        <div>
          <label htmlFor="picture">Select picture</label>
          <div className="file-container">
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              multiple
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
        <div>
          <label htmlFor="image_link">QR URL</label>
          <textarea
            className="qr"
            id="image_link"
            name="image_link"
            placeholder="Enter QR URL"
            rows="5"
          ></textarea>
          <br />
          <span className="error-msg" id="error-qr-img"></span>
        </div>
        <div className="section"></div>
        <hr />
        <div className="buttons">
          <button className="btn" type="submit">
            Run
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
