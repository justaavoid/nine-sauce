import { useEffect } from "react";

const DataFetching = ({ isProduction, setRows, setLoading }) => {
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
        setRows(rows);
        setLoading(false);
      } else {
        console.log("dev");
        // Fetch data from local JSON file in development mode
        const response = await fetch("data.json");
        data = await response.json(); // Parse JSON response
        const rows = Array.isArray(data) ? data : [];
        setRows(rows);
        setLoading(false);
      }
    }

    fetchData();
  }, [isProduction, setRows, setLoading]);

  return null;
};

export default DataFetching;
