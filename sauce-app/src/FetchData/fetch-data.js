import { useEffect } from "react";

const DataFetching = ({ setRows, setLoading, revealImage, sheetName }) => {
  useEffect(() => {
    async function fetchData() {
      let data;
      if (process.env.NODE_ENV === "production") {
        // twi - img - sauce :  1ZWeBW3g3iavrO5632YwJZNSwV4C-j0sGIZrSBmYvZMs
        // all-img-src:         1DYk_PEW173PdaMNmzjJ6z0vzwFZsdBJfs2T5p9srqPk
        const response = await fetch(
          `https://docs.google.com/spreadsheets/d/1DYk_PEW173PdaMNmzjJ6z0vzwFZsdBJfs2T5p9srqPk/gviz/tq?tqx=out:csv&sheet=${sheetName}`
        );
        // Convert response to text
        data = await response.text();
        data = data.replace(/"/g, "");
        const rows = data.split("\n").map((row) => row.split(","));

        // Remove the first rows
        rows.shift();

        rows.sort((a, b) => {
          // Assuming row[2] contains strings
          return -a[2].localeCompare(b[2]);
        });

        setRows(rows);

        // eslint-disable-next-line array-callback-return
        rows.map((rowData, index) => {
          if (rowData[3].startsWith("0")) {
            revealImage(index);
          }
        });
        setLoading(false);
      } else {
        // Fetch data from local CSV file in development mode
        const response = await fetch("data.csv");
        const csvData = await response.text(); // Get CSV data as text

        // Parse CSV data into rows and columns
        const rows = csvData.split("\n").map((row) => row.split(","));

        // Remove the first row
        rows.shift();

        rows.sort((a, b) => {
          // Assuming row[2] contains strings
          return -a[2].localeCompare(b[2]);
        });

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
  }, [setRows, setLoading]);

  return null;
};

export default DataFetching;
