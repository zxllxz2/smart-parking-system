/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
// import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";

// Eric; populate and return each parking spot entry
function populateEntry(spaceId, spaceType, availability) {
  return {
    spaceId: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {spaceId}
      </MDTypography>
    ),
    spaceType: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {spaceType}
      </MDTypography>
    ),
    avail: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {availability === 0 ? "Available" : "Unavailable"}
      </MDTypography>
    ),
    option:
      availability === 0 ? (
        <MDButton size="small" variant="outlined" color="success">
          Park
        </MDButton>
      ) : (
        <MDButton size="small" variant="outlined" color="error">
          Check Out
        </MDButton>
      ),
  };
}

// Eric; returns a new list for rows given new backend response
const getNewList = (resp) => {
  const result = [];
  resp.forEach((ele) => {
    result.push(populateEntry(ele[0], ele[1], ele[2]));
  });

  return result;
};

// Eric: method to be exported for index.js
export default function data(resp) {
  return {
    columns: [
      { Header: "Space ID", accessor: "spaceId", align: "left" },
      { Header: "Space Type", accessor: "spaceType", align: "center" },
      { Header: "Availability", accessor: "avail", align: "center" },
      { Header: "Option", accessor: "option", align: "center" },
    ],

    rows: getNewList(resp),
  };
}
