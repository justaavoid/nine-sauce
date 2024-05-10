import React from "react";
import ReactLoading from "react-loading";
import "./LinkOrButton.css";

const LinkOrButton = ({
  cellData,
  rowIndex,
  handleClick,
  countDown,
  remainingTime,
  clickedRowIndex,
  idData,
  totalRemainTime,
}) => {
  if (
    countDown &&
    remainingTime !== null &&
    remainingTime !== 0 &&
    clickedRowIndex === rowIndex
  ) {
    return (
      <span className="count-down show-link">
        <div className="loading-container">
          <ReactLoading type="spin" color="blue" height={50} width={50} />
          <span className="number gradient-text">{remainingTime}</span>
        </div>
      </span>
    );
  } else if (clickedRowIndex === rowIndex && remainingTime === 0) {
    return (
      <div className="show-link">
        <a
          href={cellData}
          target="_blank"
          rel="noopener noreferrer"
          style={{ overflow: "hidden", wordBreak: "break-all" }}
        >
          {cellData}
        </a>
      </div>
    );
  } else {
    return (
      <div class="content">
        <div class="detail">
          <ul class="sci">
            <li>
              <button onClick={() => handleClick(rowIndex, totalRemainTime)}>
                <i class="fas fa-link">{idData}</i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
};

export default LinkOrButton;
