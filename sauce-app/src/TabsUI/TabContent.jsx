import React, { useState } from "react";
import ImageContainer from "../ImageContainer/ImageContainer";
import LinkOrButton from "../LinkButton/LinkOrButton";
import {
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Stack from "@mui/material/Stack";

const TabContent = ({
  tabName,
  rows,
  revealedImages,
  handleClick,
  countDown,
  remainingTime,
  clickedRowIndex,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  const showItemsLength = [5, 10, 20, 50, 100];

  return (
    <div style={{ padding: "0 20px" }}>
      <h2 className="table-header">{tabName}</h2>
      <br />
      <hr />
      <br />

      <Stack
        spacing={2}
        display={"flex"}
        justifyContent={"center"}
        direction="row"
        alignItems={"center"}
      >
        <FormControl variant="standard" sx={{ m: 1, minWidth: "30px" }}>
          <InputLabel>Rows</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            displayEmpty
          >
            {showItemsLength.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Pagination
          boundaryCount={1}
          showFirstButton
          showLastButton
          count={Math.ceil(rows.length / rowsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          color="secondary"
        />
      </Stack>
      <br />
      <hr />
      <br />
      <div className="container">
        {currentRows.map((rowData, rowIndex) => (
          <div key={rowIndex} className="card">
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
        ))}
      </div>
      <br />
      <hr />
      <br />

      <Stack
        spacing={2}
        display={"flex"}
        justifyContent={"center"}
        direction="row"
        alignItems={"center"}
      >
        <Pagination
          siblingCount={0}
          boundaryCount={2}
          showFirstButton
          showLastButton
          count={Math.ceil(rows.length / rowsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          color="secondary"
        />
        <FormControl variant="standard" sx={{ m: 1, minWidth: "30px" }}>
          <InputLabel>Rows</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            displayEmpty
          >
            {showItemsLength.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <br />
      <hr />
      <br />
    </div>
  );
};

export default TabContent;
