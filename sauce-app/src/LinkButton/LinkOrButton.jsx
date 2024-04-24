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
}) => {
  const buttons = [
    <button
      className="button button--piyo"
      onClick={() => handleClick(rowIndex)}
    >
      <div className="button__wrapper">
        <span className="button__text">🔗 GET LINK</span>
      </div>
      <div className="characterBox">
        <div className="character wakeup">
          <div className="character__face"></div>
        </div>
        <div className="character wakeup">
          <div className="character__face"></div>
        </div>
        <div className="character">
          <div className="character__face"></div>
        </div>
      </div>
    </button>,
    <button
      className="button button--hoo"
      onClick={() => handleClick(rowIndex)}
    >
      <div className="button__wrapper">
        <span className="button__text">🔗 GET LINK</span>
      </div>
      <div className="characterBox">
        <div className="character wakeup">
          <div className="character__face"></div>
          <div className="charactor__face2"></div>
          <div className="charactor__body"></div>
        </div>
        <div className="character wakeup">
          <div className="character__face"></div>
          <div className="charactor__face2"></div>
          <div className="charactor__body"></div>
        </div>
        <div className="character">
          <div className="character__face"></div>
          <div className="charactor__face2"></div>
          <div className="charactor__body"></div>
        </div>
      </div>
    </button>,
    <button
      className="button button--pen"
      onClick={() => handleClick(rowIndex)}
    >
      <div className="button__wrapper">
        <span className="button__text">🔗 GET LINK</span>
      </div>
      <div className="characterBox">
        <div className="character wakeup">
          <div className="character__face"></div>
          <div className="charactor__face2"></div>
        </div>
        <div className="character wakeup">
          <div className="character__face"></div>
          <div className="charactor__face2"></div>
        </div>
        <div className="character">
          <div className="character__face"></div>
          <div className="charactor__face2"></div>
        </div>
      </div>
    </button>,
  ];

  if (
    countDown &&
    remainingTime !== null &&
    remainingTime !== 0 &&
    clickedRowIndex === rowIndex
  ) {
    return (
      <span className="count-down">
        <div className="loading-container">
          <ReactLoading type="spin" color="blue" height={70} width={70} />
          <span className="number gradient-text">{remainingTime}</span>
        </div>
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
    // Get the button based on rowIndex modulo the number of buttons
    const buttonIndex = rowIndex % buttons.length;

    return <div className="container">{buttons[buttonIndex]}</div>;
  }
};

export default LinkOrButton;
