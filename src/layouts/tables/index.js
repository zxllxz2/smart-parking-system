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

import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";

import { getRequest } from "../../api";

function LotTables() {
  const [menuItems, setMenuItems] = useState([]); // Eric; items in menu
  const [menu, setMenu] = useState(null);
  const [title, setTitle] = useState(menuItems[0]); // Eric; title
  const [selected, setSelected] = useState(false); // Eric; whether user has selected a parking lot
  const [numAvailable, setNumAvailable] = useState(0); // Eric; number of parking spaces available in the selected parking lot
  const [table, setTable] = useState({
    columns: [
      { Header: "Space ID", accessor: "spaceId", align: "left" },
      { Header: "Space Type", accessor: "spaceType", align: "center" },
      { Header: "Availability", accessor: "avail", align: "center" },
      { Header: "Option", accessor: "option", align: "center" },
    ],
    rows: [],
  }); // Eric; when first entering the interface, display nothing

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);

  const closeMenu = (index) => {
    setMenu(null);
    setTitle(index);
  };

  useEffect(() => {
    getRequest("/lot/all/").then((resp) => {
      if (resp) {
        setMenuItems(resp.map((each) => each[0]));
      }
    });
  }, []);

  const menuItemsOnClick = (id) => {
    setSelected(true); // Eric; user has selected a parking lot
    getRequest(`/lot/listSpace/?LID=${id}`).then((resp) => {
      if (resp) {
        setTable(authorsTableData(resp));
      }
      // Eric; only make the next backend call when the previous is done
      getRequest(`/lot/computeIdle/?LID=${id}`).then((response) => {
        if (response) {
          setNumAvailable(response[0]);
        }
      });
    });
    closeMenu(id);
  };

  const menuItem = menuItems.map((id) => (
    <MenuItem onClick={() => menuItemsOnClick(id)} key={id}>
      Parking Lot {id}
    </MenuItem>
  ));

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={() => setMenu(null)}
    >
      {menuItem}
    </Menu>
  );

  return (
    <DashboardLayout>
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
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDBox>
                  <MDTypography variant="h6" color="white">
                    Parking Lot {title}
                  </MDTypography>
                </MDBox>
                {selected && (
                  <MDTypography variant="h6" color="white">
                    {numAvailable} Available Spots
                  </MDTypography>
                )}
                <MDBox color="text" px={2}>
                  <Icon
                    sx={{ cursor: "pointer", fontWeight: "bold" }}
                    fontSize="small"
                    onClick={openMenu}
                  >
                    more_vert
                  </Icon>
                </MDBox>
                {renderMenu}
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

export default LotTables;
