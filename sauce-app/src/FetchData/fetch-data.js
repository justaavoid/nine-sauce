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

        // Extract and parse the countdown time from the first column of the first row
        const remainTime = parseInt(rows[0][1]);
        if (!isNaN(remainTime)) {
          updateRemainTime(remainTime);
        }

        // Remove the first column from all rows
        rows.shift();

        setRows(rows);
        setLoading(false);
      } else {
        console.log("dev");
        // Fetch data from local CSV file in development mode
        const response = await fetch("data.csv");
        const csvData = await response.text(); // Get CSV data as text

        // Parse CSV data into rows and columns
        const rows = csvData.split("\n").map((row) => row.split(","));

        // Extract and parse the countdown time from the first column of the first row
        const remainTime = parseInt(rows[0][1]);
        if (!isNaN(remainTime)) {
          updateRemainTime(remainTime);
        }

        // Remove the first column from all rows
        rows.shift();
        console.log(rows);

        setRows(rows);
        setLoading(false);
      }
    }

    fetchData();
  }, [isProduction, setRows, setLoading]);

  return null;
};

export default DataFetching;
