import { useEffect } from "react";

const DataFetching = ({ isProduction, setRows, setLoading, revealImage }) => {
  useEffect(() => {
    async function fetchData() {
      let data;
      if (isProduction) {
        console.log("production");
        // twi - img - sauce
        const response = await fetch(
          "https://docs.google.com/spreadsheets/d/1ZWeBW3g3iavrO5632YwJZNSwV4C-j0sGIZrSBmYvZMs/export?format=csv"
        );
        data = await response.text();
        const rows = data.split("\n").map((row) => row.split(","));

        // Remove the first rows
        rows.shift();

        setRows(rows);

        // eslint-disable-next-line array-callback-return
        rows.map((rowData, index) => {
          if (rowData[3].startsWith("0")) {
            revealImage(index);
          }
        });
        setLoading(false);
      } else {
        console.log("dev");
        // Fetch data from local CSV file in development mode
        const response = await fetch("data.csv");
        const csvData = await response.text(); // Get CSV data as text

        // Parse CSV data into rows and columns
        const rows = csvData.split("\n").map((row) => row.split(","));

        // Remove the first row
        rows.shift();
        setRows(rows);
        // eslint-disable-next-line array-callback-return
        rows.map((rowData, index) => {
          if (rowData[3].startsWith("0")) {
            revealImage(index);
          }
        });
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProduction, setRows, setLoading]);

  return null;
};

export default DataFetching;
