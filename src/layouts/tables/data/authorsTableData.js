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

export default function data() {
  // const Job = ({ title }) => (
  //   <MDBox lineHeight={1} textAlign="left">
  //     <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
  //       {title}
  //     </MDTypography>
  //     {/* <MDTypography variant="caption">{description}</MDTypography> */}
  //   </MDBox>
  // );
  return {
    columns: [
      { Header: "Space ID", accessor: "spaceId", align: "left" },
      { Header: "Space Type", accessor: "spaceType", align: "center" },
      { Header: "Availability", accessor: "avail", align: "center" },
      { Header: "Option", accessor: "option", align: "center" },
    ],

    rows: [
      {
        spaceId: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            1036
          </MDTypography>
        ),
        spaceType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Truck
          </MDTypography>
        ),
        avail: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Available
          </MDTypography>
        ),
        option: (
          <MDButton size="small" variant="outlined" color="success">
            Park
          </MDButton>
        ),
      },
      {
        spaceId: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            2026
          </MDTypography>
        ),
        spaceType: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Standard
          </MDTypography>
        ),
        avail: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Unavailable
          </MDTypography>
        ),
        option: (
          <MDButton size="small" variant="outlined" color="error">
            Check Out
          </MDButton>
        ),
      },
    ],
  };
}
