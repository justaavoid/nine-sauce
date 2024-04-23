import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";

const remainTime = 30;
const isProduction = process.env.NODE_ENV === "production";

function App() {
  const [rows, setRows] = useState([]);
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countDown, setCountDown] = useState(true);
  const [countdownPaused, setCountdownPaused] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    async function fetchData() {
      let data;
      if (isProduction) {
        console.log("production");
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/1of1pkodGvVWOJE8vHDw7naNt8xvmPwyE284fJ7P4kRk/export?format=csv"
        );
        data = await response.text();
        const rows = data.split("\n").map((row) => row.split(","));
        setRows(rows);
        setLoading(false);
      } else {
        // Fetch data from local JSON file in development mode
        const response = await fetch("data.json");
        data = await response.json(); // Parse JSON response
        const rows = Array.isArray(data) ? data : [];
        setRows(rows);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Function to handle click on link cell
  function handleClick(rowIndex) {
    setClickedRowIndex(rowIndex);
    setRemainingTime(remainTime);
    setCountDown(true);
  }

  // Function to handle rendering the link or button
  const renderLinkOrButton = (cellData, rowIndex) => {
    if (
      countDown &&
      remainingTime !== null &&
      remainingTime !== 0 &&
      clickedRowIndex === rowIndex
    ) {
      return (
        <span className="count-down">
          <span>
            <ReactLoading type="bubbles" color="blue" />
          </span>
          <span className="number gradient-text">{remainingTime}</span>
        </span>
      );
    } else if (clickedRowIndex === rowIndex && remainingTime === 0) {
      return (
        <div>
          <a href={cellData} target="_blank" rel="noopener noreferrer">
            {cellData}
          </a>
        </div>
      );
    } else {
      return (
        <>
          <button className="open-link" onClick={() => handleClick(rowIndex)}>
            👁️🔗 GET LINK
          </button>
        </>
      );
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
                    <img
                      className="image-id"
                      src={cellData}
                      alt={`Image ${rowIndex}-${cellIndex}`}
                    />
                  ) : cellIndex === 1 ? (
                    renderLinkOrButton(cellData, rowIndex)
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
