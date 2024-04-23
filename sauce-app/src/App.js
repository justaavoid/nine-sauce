import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
const remainTime = 5;
function App() {
  const [rows, setRows] = useState([]);
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdownPaused, setCountdownPaused] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://docs.google.com/spreadsheets/d/1of1pkodGvVWOJE8vHDw7naNt8xvmPwyE284fJ7P4kRk/export?format=csv"
      );
      const data = await response.text();
      const rows = data.split("\n").map((row) => row.split(","));
      setRows(rows);
    }

    fetchData();
  }, []);

  // Function to handle click on link cell
  function handleClick(rowIndex) {
    setClickedRowIndex(rowIndex);
    setRemainingTime(remainTime);
    setLoading(true);
  }

  // Function to handle rendering the link or button
  const renderLinkOrButton = (cellData, rowIndex) => {
    if (loading && remainingTime !== null && clickedRowIndex === rowIndex) {
      return (
        <span>
          <span className="loading">🔎</span>
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
          <button onClick={() => handleClick(rowIndex)}>open</button>
          <span className="safe">✔️</span>
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
      <h2 className="table-header">TABLE HEADER</h2>
      <ul className="responsive-table">
        {rows.map((rowData, rowIndex) => (
          <li key={rowIndex} className="table-row">
            {rowData.map((cellData, cellIndex) => (
              <div
                key={cellIndex}
                className="col"
                id={`tableline${rowIndex}-${cellIndex}`}
              >
                {cellIndex === 1
                  ? renderLinkOrButton(cellData, rowIndex)
                  : cellData}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
