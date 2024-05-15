import { useEffect } from "react";

const DataFetching = ({ setRows, setLoading, revealImage, sheetName }) => {
  const sortDataByDate = (data) => {
    return data
      .map((row) => {
        const dateStr = row[5]; // date-create column
        const [day, month, year] = dateStr.split("/").map(Number);
        return { row, dateObj: new Date(year, month - 1, day) };
      })
      .sort((a, b) => b.dateObj - a.dateObj)
      .map((item) => item.row);
  };

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
          // Assuming row[5] contains strings
          return -a[5].localeCompare(b[5]);
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

        const sortedRows = await sortDataByDate(rows);

        setRows(sortedRows);
        // eslint-disable-next-line array-callback-return
        sortedRows.map((rowData, index) => {
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
