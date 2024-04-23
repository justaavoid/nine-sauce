// Define the main React component
function App() {
  const remainTime = 5;
  const [rows, setRows] = React.useState([]);
  const [clickedRowIndex, setClickedRowIndex] = React.useState(null);
  const [remainingTime, setRemainingTime] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [countdownPaused, setCountdownPaused] = React.useState(false);

  // Fetch data when component mounts
  React.useEffect(() => {
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
  React.useEffect(() => {
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

  React.useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  React.useEffect(() => {
    if (remainingTime !== null) {
      localStorage.setItem("remainingTime", remainingTime);
    }
  }, [remainingTime]);

  // Function to handle continue button click
  const handleContinueClick = () => {
    setCountdownPaused(false);
  };

  return (
    <>
      <h2 class="table-header">TABLE HEADER</h2>
      <ul class="responsive-table">
        {rows.map((rowData, rowIndex) => (
          <li key={rowIndex} class="table-row">
            {rowData.map((cellData, cellIndex) => (
              <div
                key={cellIndex}
                class="col"
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

// Render the React component to the root element
ReactDOM.render(<App />, document.getElementById("root"));

// JavaScript for pagination
$("li").click(function () {
  $(this).addClass("active").siblings().removeClass("active");
});
