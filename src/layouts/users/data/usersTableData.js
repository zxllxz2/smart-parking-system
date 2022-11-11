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

export default function data() {
  return {
    columns: [
      { Header: "Name", accessor: "name", align: "left" },
      { Header: "Phone Number", accessor: "phone", align: "center" },
      { Header: "Date of Birth", accessor: "dob", align: "center" },
      { Header: "Vehicle Plate Number", accessor: "plate", align: "center" },
      { Header: "Parking Lot", accessor: "lot", align: "center" },
      { Header: "Parking Space", accessor: "space", align: "center" },
    ],

    rows: [
      {
        name: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Peter Parker
          </MDTypography>
        ),
        phone: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            123-123-1321
          </MDTypography>
        ),
        dob: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Jun 2 2022
          </MDTypography>
        ),
        plate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            BCC1765
          </MDTypography>
        ),
        lot: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            A12
          </MDTypography>
        ),
        space: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            1234
          </MDTypography>
        ),
      },
      {
        name: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Parker Peter
          </MDTypography>
        ),
        phone: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            325-965-8898
          </MDTypography>
        ),
        dob: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Feb 30 2000
          </MDTypography>
        ),
        plate: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            NULL
          </MDTypography>
        ),
        lot: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            NULL
          </MDTypography>
        ),
        space: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            NULL
          </MDTypography>
        ),
      },
    ],
  };
}
