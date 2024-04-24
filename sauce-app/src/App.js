import React from "react";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import ReactLoading from "react-loading";
import DataFetching from "./FetchData/fetch-data";
import LinkOrButton from "./LinkButton/LinkOrButton";
import ImageContainer from "./ImageContainer/ImageContainer";

function App() {
  const [remainTime, setRemainTime] = useState(30);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const isProduction = process.env.NODE_ENV === "production";
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [countDown, setCountDown] = useState(true);
  const [countdownPaused, setCountdownPaused] = useState(false);
  // State to track which images are revealed
  const [revealedImages, setRevealedImages] = useState([]);

  // Function to handle click on link cell
  function handleClick(rowIndex) {
    setClickedRowIndex(rowIndex);
    setRemainingTime(remainTime);
    setCountDown(true);
  }

  // Function to update remainTime
  const updateRemainTime = (newItem) => {
    if (!isNaN(newItem)) {
      setRemainTime(newItem);
    }
  };

  // Function to handle countdown
  useEffect(() => {
    let interval;
    if (remainingTime !== null && remainingTime > 0 && !countdownPaused) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setLoading(false);
    }

    return () => clearInterval(interval);
  }, [remainingTime, countdownPaused]);

  // Function to handle page visibility change
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      const storedRemainingTime = localStorage.getItem("remainingTime");
      if (storedRemainingTime !== null) {
        setRemainingTime(parseInt(storedRemainingTime));
        setCountdownPaused(false); // Resume countdown when tab becomes visible
      }
    } else {
      setCountdownPaused(true); // Pause countdown when tab becomes invisible
    }
  };

  // Function to handle revealing an image
  const revealImage = (rowIndex) => {
    // Check if image at rowIndex is already revealed
    if (!revealedImages.includes(rowIndex)) {
      // Add the rowIndex to revealedImages state
      setRevealedImages([...revealedImages, rowIndex]);
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (remainingTime !== null) {
      localStorage.setItem("remainingTime", remainingTime);
    }
  }, [remainingTime]);

  return (
    <>
      <DataFetching
        isProduction={isProduction}
        setRows={setRows}
        setLoading={setLoading}
        updateRemainTime={updateRemainTime}
      />
      <h2 className="table-header">HAVE A NICE TIME</h2>
      {loading ? (
        <div className="loading-icon">
          <ReactLoading type="bars" color="#000" />
        </div>
      ) : (
        <ul className="responsive-table">
          {rows.map((rowData, rowIndex) => (
            <li key={rowIndex} className="table-row">
              {rowData.map((cellData, cellIndex) => (
                <div
                  key={cellIndex}
                  className="col"
                  id={`tableline${rowIndex}-${cellIndex}`}
                >
                  {cellIndex === 0 ? (
                    <ImageContainer
                      cellData={cellData}
                      revealedImages={revealedImages}
                      rowIndex={rowIndex}
                      revealImage={revealImage}
                    />
                  ) : cellIndex === 1 ? (
                    <LinkOrButton
                      cellData={cellData}
                      rowIndex={rowIndex}
                      handleClick={handleClick}
                      countDown={countDown}
                      remainingTime={remainingTime}
                      clickedRowIndex={clickedRowIndex}
                    />
                  ) : (
                    cellData
                  )}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
