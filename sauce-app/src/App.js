import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import DataFetching from "./FetchData/fetch-data";
import LinkOrButton from "./LinkButton/LinkOrButton";
import ImageContainer from "./ImageContainer/ImageContainer";
import { Tabs, Tab } from "@mui/material";

function App() {
  const [, setRemainTime] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedRowIndex, setClickedRowIndex] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [countDown, setCountDown] = useState(true);
  const [countdownPaused, setCountdownPaused] = useState(false);
  // State to track which images are revealed
  const [revealedImages, setRevealedImages] = useState([]);

  // Function to handle click on link cell
  function handleClick(rowIndex, remainTime) {
    setClickedRowIndex(rowIndex);
    setRemainingTime(remainTime);
    setCountDown(true);
    updateRemainTime(remainTime);
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

  const revealImage = (rowIndex) => {
    setRevealedImages((prevRevealedImages) => {
      if (!prevRevealedImages.includes(rowIndex)) {
        return [...prevRevealedImages, rowIndex];
      }
      return prevRevealedImages;
    });
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

  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    setClickedRowIndex(null);
  };

  return (
    <>
      <div>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
          scrollButtons="auto"
        >
          <Tab label="Twitter" />
          <Tab label="Facebook" />
          <Tab label="Instagram" />
          <Tab label="Youtube" />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          <DataFetching
            setRows={setRows}
            setLoading={setLoading}
            revealImage={revealImage}
            sheetName={"twi"}
          />
          <h2 className="table-header">Twitter</h2>
          {loading ? (
            <div className="loading-icon">
              <ReactLoading type="bars" color="#000" />
            </div>
          ) : (
            <div class="container">
              {rows.map((rowData, rowIndex) => (
                <>
                  {console.log(rowData[2])}
                  <div key={rowIndex} class="card">
                    <ImageContainer
                      cellData={rowData[0]}
                      revealedImages={revealedImages}
                      rowIndex={rowIndex}
                      isSensitive={rowData[3]}
                    />
                    <LinkOrButton
                      cellData={rowData[1]}
                      rowIndex={rowIndex}
                      handleClick={handleClick}
                      countDown={countDown}
                      remainingTime={remainingTime}
                      clickedRowIndex={clickedRowIndex}
                      idData={rowData[2]}
                      totalRemainTime={rowData[4]}
                    />
                  </div>
                </>
              ))}
            </div>
          )}
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <DataFetching
            setRows={setRows}
            setLoading={setLoading}
            revealImage={revealImage}
            sheetName={"si"}
          />
          <h2 className="table-header">Si</h2>
          {loading ? (
            <div className="loading-icon">
              <ReactLoading type="bars" color="#000" />
            </div>
          ) : (
            <div class="container">
              {rows.map((rowData, rowIndex) => (
                <>
                  {console.log(rowData[2])}
                  <div key={rowIndex} class="card">
                    <ImageContainer
                      cellData={rowData[0]}
                      revealedImages={revealedImages}
                      rowIndex={rowIndex}
                      isSensitive={rowData[3]}
                    />
                    <LinkOrButton
                      cellData={rowData[1]}
                      rowIndex={rowIndex}
                      handleClick={handleClick}
                      countDown={countDown}
                      remainingTime={remainingTime}
                      clickedRowIndex={clickedRowIndex}
                      idData={rowData[2]}
                      totalRemainTime={rowData[4]}
                    />
                  </div>
                </>
              ))}
            </div>
          )}
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <DataFetching
            setRows={setRows}
            setLoading={setLoading}
            revealImage={revealImage}
            sheetName={"two"}
          />
          <h2 className="table-header">Two</h2>
          {loading ? (
            <div className="loading-icon">
              <ReactLoading type="bars" color="#000" />
            </div>
          ) : (
            <div class="container">
              {rows.map((rowData, rowIndex) => (
                <>
                  {console.log(rowData[2])}
                  <div key={rowIndex} class="card">
                    <ImageContainer
                      cellData={rowData[0]}
                      revealedImages={revealedImages}
                      rowIndex={rowIndex}
                      isSensitive={rowData[3]}
                    />
                    <LinkOrButton
                      cellData={rowData[1]}
                      rowIndex={rowIndex}
                      handleClick={handleClick}
                      countDown={countDown}
                      remainingTime={remainingTime}
                      clickedRowIndex={clickedRowIndex}
                      idData={rowData[2]}
                      totalRemainTime={rowData[4]}
                    />
                  </div>
                </>
              ))}
            </div>
          )}
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <DataFetching
            setRows={setRows}
            setLoading={setLoading}
            revealImage={revealImage}
            sheetName={"cos"}
          />
          <h2 className="table-header">Cos</h2>
          {loading ? (
            <div className="loading-icon">
              <ReactLoading type="bars" color="#000" />
            </div>
          ) : (
            <div class="container">
              {rows.map((rowData, rowIndex) => (
                <>
                  {console.log(rowData[2])}
                  <div key={rowIndex} class="card">
                    <ImageContainer
                      cellData={rowData[0]}
                      revealedImages={revealedImages}
                      rowIndex={rowIndex}
                      isSensitive={rowData[3]}
                    />
                    <LinkOrButton
                      cellData={rowData[1]}
                      rowIndex={rowIndex}
                      handleClick={handleClick}
                      countDown={countDown}
                      remainingTime={remainingTime}
                      clickedRowIndex={clickedRowIndex}
                      idData={rowData[2]}
                      totalRemainTime={rowData[4]}
                    />
                  </div>
                </>
              ))}
            </div>
          )}
        </TabPanel>
      </div>
    </>
  );
}

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <>{children}</>}
    </div>
  );
};

export default App;
