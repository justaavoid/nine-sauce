// import React, { useState } from "react";
// import { Tabs, Tab } from "@mui/material";
// import ReactLoading from "react-loading";
// import LinkOrButton from "../LinkButton/LinkOrButton";
// import ImageContainer from "../ImageContainer/ImageContainer";
// import DataFetching from "../FetchData/fetch-data";

// const MyTabs = (
//   loading,
//   rows,
//   revealedImages,
//   handleClick,
//   countDown,
//   remainingTime,
//   clickedRowIndex
// ) => {
//   const [selectedTab, setSelectedTab] = useState(0);

//   const handleChange = (event, newValue) => {
//     setSelectedTab(newValue);
//   };

//   return (
//     <div>
//       <Tabs
//         value={selectedTab}
//         onChange={handleChange}
//         aria-label="basic tabs example"
//       >
//         <Tab label="Tab 1" />
//         <Tab label="Tab 2" />
//         <Tab label="Tab 3" />
//       </Tabs>
//       <TabPanel value={selectedTab} index={0}>
//         <DataFetching
//           isProduction={isProduction}
//           setRows={setRows}
//           setLoading={setLoading}
//           revealImage={revealImage}
//           sheetName={sheetName}
//         />
//         <h2 className="table-header">HAVE A NICE TIME</h2>
//         {loading ? (
//           <div className="loading-icon">
//             <ReactLoading type="bars" color="#000" />
//           </div>
//         ) : (
//           <div class="container">
//             {rows.map((rowData, rowIndex) => (
//               <>
//                 {console.log(rowData[2])}
//                 <div key={rowIndex} class="card">
//                   <ImageContainer
//                     cellData={rowData[0]}
//                     revealedImages={revealedImages}
//                     rowIndex={rowIndex}
//                     isSensitive={rowData[3]}
//                   />
//                   <LinkOrButton
//                     cellData={rowData[1]}
//                     rowIndex={rowIndex}
//                     handleClick={handleClick}
//                     countDown={countDown}
//                     remainingTime={remainingTime}
//                     clickedRowIndex={clickedRowIndex}
//                     idData={rowData[2]}
//                     totalRemainTime={rowData[4]}
//                   />
//                 </div>
//               </>
//             ))}
//           </div>
//         )}
//       </TabPanel>
//       <TabPanel value={selectedTab} index={1}>
//         Content for Tab 2
//       </TabPanel>
//       <TabPanel value={selectedTab} index={2}>
//         Content for Tab 3
//       </TabPanel>
//     </div>
//   );
// };

// const TabPanel = ({ children, value, index }) => {
//   return (
//     <div role="tabpanel" hidden={value !== index}>
//       {value === index && <>{children}</>}
//     </div>
//   );
// };

// export default MyTabs;
