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

// Eric; populate and return each user entry
function populateEntry(fname, minit, lname, dob, phoneNum, plate, type, lid, spaceNo, checkInDate) {
  return {
    name: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {[fname, " ", minit, " ", lname]}
      </MDTypography>
    ),
    dob: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {dob}
      </MDTypography>
    ),
    phone: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {phoneNum === null ? "N/A" : phoneNum}
      </MDTypography>
    ),
    plate: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {plate}
      </MDTypography>
    ),
    type: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {type}
      </MDTypography>
    ),
    lot: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {lid === null ? "N/A" : lid}
      </MDTypography>
    ),
    space: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {spaceNo === null ? "N/A" : spaceNo}
      </MDTypography>
    ),
    time: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {checkInDate === null ? "N/A" : checkInDate}
      </MDTypography>
    ),
  };
}

// Eric; returns a new list for rows given new backend response
const getNewList = (resp) => {
  const result = [];
  resp.forEach((ele) => {
    result.push(
      populateEntry(ele[0], ele[1], ele[2], ele[3], ele[4], ele[5], ele[6], ele[7], ele[8], ele[9])
    );
  });

  return result;
};

export default function data(resp) {
  return {
    columns: [
      { Header: "Name", accessor: "name", align: "left" },
      { Header: "Date of Birth", accessor: "dob", align: "center" },
      { Header: "Phone Number", accessor: "phone", align: "center" },
      { Header: "Vehicle Plate Number", accessor: "plate", align: "center" },
      { Header: "Vehicle Type", accessor: "type", align: "center" },
      { Header: "Parking Lot", accessor: "lot", align: "center" },
      { Header: "Parking Space", accessor: "space", align: "center" },
      { Header: "Check-In Time", accessor: "time", align: "center" },
    ],

    rows: getNewList(resp),
  };
}
