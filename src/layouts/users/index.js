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
import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import usersTableData from "layouts/users/data/usersTableData";

import { getRequest } from "../../api";

function Users() {
  const [table, setTable] = useState({
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
    rows: [],
  }); // Eric; when first entering the interface, display nothing

  // Eric; when user searches through pressing Enter
  function handleEnter(input) {
    getRequest(`/user/listOwner/?ID=${input}`).then((response) => {
      if (response) {
        setTable(usersTableData(response));
      }
    });
  }

  return (
    <DashboardLayout>
      {/* <DashboardNavbar /> */}
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="light"
                borderRadius="lg"
                coloredShadow="light"
              >
                <MDBox>
                  <MDTypography variant="h6" color="dark">
                    User Search
                  </MDTypography>
                </MDBox>
                <MDBox color="text" px={1} py={2}>
                  <MDBox pr={1} style={{ margin: `0 0 0 10px` }}>
                    <Icon style={{ margin: `13px 5px 0 -12px` }}>search</Icon>
                    <MDInput
                      label="Search here"
                      onKeyPress={(e) => {
                        if (e.code === "Enter") {
                          handleEnter(e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                  </MDBox>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={table}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Users;
