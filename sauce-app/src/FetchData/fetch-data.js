import { useEffect } from "react";

const DataFetching = ({
  isProduction,
  setRows,
  setLoading,
  updateRemainTime,
}) => {
  useEffect(() => {
    async function fetchData() {
      let data;
      if (isProduction) {
        console.log("production");
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/11REayKptZ5q_nts321cm6xUHhJWpGRvd1KpmrMGvf9Q/export?format=csv"
        );
        data = await response.text();
        const rows = data.split("\n").map((row) => row.split(","));
        // Extract and parse the new item from the data
        const remainTime = parseInt(rows[0][2]); // Assuming the new item is in the first row and third column
        if (!isNaN(remainTime)) {
          updateRemainTime(remainTime);
        }
        // Clear the content of rows[0][2]
        if (rows.length > 0 && rows[0].length > 2) {
          rows[0][2] = "";
        }
        setRows(rows);
        setLoading(false);
      } else {
        console.log("dev");
        // Fetch data from local JSON file in development mode
        const response = await fetch("data.json");
        data = await response.json(); // Parse JSON response
        const rows = Array.isArray(data) ? data : [];

        // Clear the content of rows[i][2] for each row
        if (rows[0].length > 2) {
          console.log("has time");
          const remainTime = parseInt(rows[0][2]); // Assuming the new item is in the first row and third column
          if (!isNaN(remainTime)) {
            updateRemainTime(remainTime);
          }
          rows[0][2] = "";
        }

        setRows(rows);
        setLoading(false);
      }
    }

    fetchData();
  }, [isProduction, setRows, setLoading]);

  return null;
};

export default DataFetching;
