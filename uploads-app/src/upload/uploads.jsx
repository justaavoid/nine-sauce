import React, { useState } from "react";
import "./uploads.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Result from "../result/container";
import ReactLoading from "react-loading";

function UploadForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [latestUpload, setLatestUpload] = useState({
    imageLink: "",
    cloudinaryImageUrl: "",
  });
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [, setFormData] = useState({
    picture: "",
    image_link: "",
    idName: "",
    isSensitive: false,
    waitTime: 5,
    tabName: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target;
    const formData = new FormData(form);

    const picture = formData.get("picture");
    const image_link = formData.get("image_link");
    const idName = formData.get("idName");
    const isSensitive = formData.get("isSensitive") === "on";
    const waitTime = formData.get("waitTime");
    const tabName = formData.get("tabName");

    // You can also update state if needed
    setFormData({
      ...formData,
      picture,
      image_link,
      idName,
      isSensitive,
      waitTime,
      tabName,
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
        waitTime,
        tabName
      );
      setLatestUpload({
        imageLink: image_link,
        cloudinaryImageUrl: cloudinaryResponse.secure_url,
      });
      setIsUploadSuccess(true);

      // Optionally, you can reset the form after submission
      form.reset();
    } catch (error) {
      toast.error("Failed to upload data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
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

        // Show notification
        toast.success("Cloudinary successfully");

        // Return Cloudinary response
        return cloudinaryResponse;
      } else {
        throw new Error("Failed to upload image to Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      // Show error notification
      toast.error("Cloudinary failed");
      throw error;
    }
  };

  const formatImageUrl = (imgUrl) => {
    if (!imgUrl.startsWith("https://")) {
      imgUrl = "https://www.google.com/search?q=" + imgUrl;
    }
    return imgUrl;
  };

  const addRowToGoogleSheet = async (
    cloudinaryImageUrl,
    imageUrl,
    idName,
    isSen,
    waitTime,
    tabName
  ) => {
    try {
      const sheetName = tabName !== "" ? tabName : "twi";
      imageUrl = formatImageUrl(imageUrl);
      // Construct the URL for adding a new row to SheetDB
      const sheetDbUrl = `https://sheetdb.io/api/v1/0qivd7rw00pqd?sheet=${sheetName}`;

      // Construct the headers with Bearer token for authentication
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer auezwno7zbg9cxuceefbpzz6wa5b7czsmfb0egyu",
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
        toast.success("Data adding successfully");
      } else {
        toast.error("Failed to add new data");
        throw new Error("Failed to add new data");
      }
    } catch (error) {
      console.error("Error adding new data:", error);
      throw error;
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <h1>Image Uploads Cloudinary</h1>
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
            rows="3"
            onChange={handleInputChange}
          ></textarea>
          <br />
        </div>
        <div className="section"></div>
        <hr />
        <div className="idNum one-line">
          <label htmlFor="idName">ID</label>
          <input name="idName" type="text" />
        </div>
        <hr />
        <div className="isSensitive one-line">
          <label htmlFor="isSensitive">isSen</label>
          <input name="isSensitive" type="checkbox" />
        </div>
        <hr />
        <div className="wait-time one-line">
          <label htmlFor="waitTime">Wait time</label>
          <input
            className="waitTime"
            name="waitTime"
            type="number"
            defaultValue={5}
          />
        </div>
        <hr />
        <div className="tab-name one-line">
          <label htmlFor="tabName">Tab name</label>
          <select name="tabName" id="tabName">
            <option value="twi">twitter</option>
            <option value="si">se x/JAV</option>
            <option value="two">hen tai</option>
            <option value="cos">cosplay</option>
          </select>
        </div>
        <hr />
        {isLoading ? (
          <ReactLoading type="spin" color="#fff" height={24} width={24} />
        ) : (
          <div className="buttons">
            <button className="btn" type="submit">
              Upload
            </button>

            <a href="/" className="btn">
              Home
            </a>
          </div>
        )}
      </form>
      {isUploadSuccess && (
        <Result
          imageLink={latestUpload.imageLink}
          cloudinaryImageUrl={latestUpload.cloudinaryImageUrl}
        />
      )}
    </div>
  );
}

export default UploadForm;
