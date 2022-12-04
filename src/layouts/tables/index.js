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
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
// Requests
import { getRequest, postRequest } from "../../api";

function LotTables() {
  // State declaration
  const [menuItems, setMenuItems] = useState([]); // Eric; items in menu
  const [menu, setMenu] = useState(null);
  const [title, setTitle] = useState(""); // Eric; title
  const [selected, setSelected] = useState(false); // Eric; whether user has selected a parking lot
  const [numAvailable, setNumAvailable] = useState(0); // Eric; number of parking spaces available in the selected parking lot
  // Eric; when first entering the interface, display nothing
  const tableHeaders = [
    { Header: "Space ID", accessor: "spaceId", align: "left" },
    { Header: "Space Type", accessor: "spaceType", align: "center" },
    { Header: "Availability", accessor: "avail", align: "center" },
    { Header: "Option", accessor: "option", align: "center" },
  ];
  const [table, setTable] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(0); // Toby; set dialog
  const [alertx, setAlert] = useState(0); // Toby; set alert
  const [notif, setNotif] = useState(false); // Toby; set notification
  const [msgType, setMsgType] = useState("success"); // Toby; set notification type
  // Toby; dialog input for user
  const [last, setLast] = useState("");
  const [first, setFirst] = useState("");
  const [mid, setMid] = useState("");
  const [dob, setDob] = useState("");
  const [license, setLicense] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  // Toby; dialog input for vehicle
  const [plate, setPlate] = useState("");
  const [vType, setVType] = useState("");
  const [height, setHeight] = useState(0);
  // Toby; selected space (space, curType)
  const [curSpace, setCurSpace] = useState([]);
  // Toby; dialog for checkout
  const [out, setOut] = useState(0);
  const [outInfo, setOutInfo] = useState(null);
  // Toby; display parked car
  const [parked, setParked] = useState({ lot: "", space: "", plate: "", time: "" });

  // ===================================================================
  // Function declaration

  // Toby; vehicle type choices
  const vehicleTypes = ["Truck", "Compact", "Noncompact"];
  let lotID = null;

  // Toby; open and close dialog
  const openDialog = (event) => {
    event.preventDefault();
    const row = event.target.parentElement.parentElement.parentElement;
    const space = row.children[0].getElementsByTagName("a")[0].textContent;
    const curType = row.children[1].getElementsByTagName("a")[0].textContent;
    setCurSpace([space, curType]);
    setDialogOpen(1);
  };
  const closeDialog = () => setDialogOpen(0);

  // Toby; manipulate alert and dialog
  const opAlertDialog = (modeAlert, modeDialog) => {
    setAlert(modeAlert);
    setDialogOpen(modeDialog);
  };

  // Toby; open and close check-out dialog
  const alertCheckOut = (event) => {
    const row = event.target.parentElement.parentElement.parentElement;
    const space = row.children[0].getElementsByTagName("a")[0].textContent;
    const curType = row.children[1].getElementsByTagName("a")[0].textContent;
    getRequest(`/vehicle/precheckout/?LID=${lotID}&spaceNo=${space}`).then((response) => {
      if (response) {
        const resp = response;
        resp.type = curType;
        resp.spaceNo = space;
        resp.finalP = 0;
        resp.lotId = lotID;
        setOutInfo(resp);
      }
    });
    if (window.confirm("Are you sure you want to check out here?")) {
      setOut(1);
    }
  };
  const closeCheckOut = () => {
    setOut(0);
  };

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = (index) => {
    setTitle(index);
    setMenu(null);
  };

  // Toby; mount info about parking lot only once
  useEffect(() => {
    getRequest("/lot/all/").then((resp) => {
      if (resp) {
        setMenuItems(resp.map((each) => each[0]));
      }
    });
  }, []);

  // Toby; set payment window alive time
  useEffect(() => {
    if (out === 2) {
      setTimeout(() => {
        closeCheckOut();
      }, 300000);
    }
  }, [out]);

  const menuItemsOnClick = (id) => {
    setSelected(true); // Eric; user has selected a parking lot
    getRequest(`/lot/listSpace/?LID=${id}`).then((resp) => {
      if (resp) {
        setTable(authorsTableData(resp, openDialog, alertCheckOut));
      }
      // Eric; only make the next backend call when the previous is done
      getRequest(`/lot/computeIdle/?LID=${id}`).then((response) => {
        if (response) {
          setNumAvailable(response[0]);
        }
      });
    });
    lotID = id;
    closeMenu(id);
  };

  // Toby; submit user data
  const submitForm = (event) => {
    event.preventDefault();
    getRequest(`/user/check/?li=${license}&dob=${dob}`).then((resp) => {
      if (resp) {
        if (resp.length === 0) {
          setAlert(1);
        } else {
          setLast(resp[0][1]);
          setMid(resp[0][2]);
          setFirst(resp[0][3]);
          setAlert(2);
        }
      }
    });
  };

  // Toby; submit vehicle data
  const submitFormVehicle = (event) => {
    event.preventDefault();
    if (vType !== curSpace[1] && (vType === "Truck" || curSpace[1] === "Truck")) {
      alert("\nUnmatched vehicle type! \nPlease choose the compatible parking space!");
      return;
    }
    const oneVehicle = {
      plate_number: plate,
      vehicle_type: vType,
      vehicle_height: height,
      license_num: license,
    };
    postRequest("/vehicle/", oneVehicle).then((resp) => {
      if (resp) {
        if (resp.length === 0) {
          setAlert(3);
        } else {
          setParked({
            lot: resp[0],
            space: resp[1],
            plate: resp[2],
            time: resp[3],
          });
          setAlert(4);
        }
      }
    });
  };

  // Toby; insert a new user
  const registerNewUser = (event) => {
    event.preventDefault();
    const newUser = {
      last_name: last,
      first_name: first,
      mid_init: mid,
      date_of_birth: dob,
      license_number: license,
      phone_1: phone1,
      phone_2: phone2,
    };
    postRequest("/user/", newUser).then((resp) => {
      if (resp) {
        setMsgType("success");
        setNotif(true);
        opAlertDialog(0, 2);
      } else {
        setMsgType("error");
        setNotif(true);
        setAlert(0);
      }
    });
  };

  // Toby; parking
  const parking = (event) => {
    event.preventDefault();
    const payload = {
      plate_number: plate,
      LID: title,
      space_number: curSpace[0],
    };
    postRequest("/vehicle/park/", payload).then((resp) => {
      if (resp) {
        setMsgType("success");
        setNotif(true);
        menuItemsOnClick(title);
        opAlertDialog(0, 0);
      } else {
        setMsgType("error");
        setNotif(true);
        setAlert(0);
      }
    });
  };

  // Toby; compute payment
  const goPayment = () => {
    getRequest(`/vehicle/precheckout/fee/?time=${outInfo.checkin}&price=${outInfo.price}`).then(
      (resp) => {
        if (resp !== null) {
          const newOutInfo = outInfo;
          newOutInfo.finalP = resp;
          setOutInfo(newOutInfo);
          setOut(2);
        }
      }
    );
  };

  // Toby; finish the parking transaction
  const settlePark = () => {
    postRequest("/vehicle/checkout/", outInfo).then((resp) => {
      if (resp) {
        setMsgType("success");
        setNotif(true);
        menuItemsOnClick(title);
        closeCheckOut();
      } else {
        setMsgType("error");
        setNotif(true);
      }
    });
  };

  // ==========================================================================
  // HTML declaration

  // Toby; load checkout information
  const renderCheckoutInfo =
    outInfo === null ? null : (
      <div style={{ margin: "15px 0 0 15px" }}>
        <p>
          <b>User License Number:</b> {outInfo.license}
        </p>
        <p>
          <b>Parking Lot:</b> {title}
        </p>
        <p>
          <b>Pakring Space:</b> {outInfo.spaceNo}
        </p>
        <p>
          <b>Space Hourly Price:</b> ${outInfo.price}
        </p>
        <p>
          <b>Vehicle Plate Number:</b> {outInfo.plate}
        </p>
        <p>
          <b>Vehicle Type:</b> {outInfo.type}
        </p>
        <p>
          <b>Check-in Time:</b> {outInfo.checkin}
        </p>
      </div>
    );

  // Toby; render check out ui
  const renderCheckOut = (
    <div>
      <Dialog
        open={out === 1}
        onClose={closeCheckOut}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle> Parking Receipt </DialogTitle>
        <DialogContent>
          <DialogContentText> Please confirm the below information is correct. </DialogContentText>
          {renderCheckoutInfo}
        </DialogContent>
        <DialogActions>
          <MDButton size="small" variant="outlined" color="success" onClick={goPayment}>
            Confirm
          </MDButton>
          <MDButton size="small" variant="outlined" color="error" onClick={closeCheckOut}>
            Cancel
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={out === 2}
        onClose={closeCheckOut}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle> Payment Information </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ margin: "0 0 15px 20px" }}>
            Your total payment is <b>${outInfo === null ? 0 : outInfo.finalP}</b>. <br />
            Please enter your payment information. <br />
            You will have 5 minutes to finish your payment. The window will close when time is up.
          </DialogContentText>
          <MDBox
            sx={{
              "& .MuiTextField-root": { m: 2, width: "30ch" },
            }}
          >
            <TextField required id="x1" label="Card Number" />
            <TextField required id="x2" label="Card Holder Name" />
            <TextField required id="X3" label="CSV/CVV/CVC" />
            <TextField
              required
              id="X4"
              label="Expires"
              type="month"
              InputLabelProps={{ shrink: true }}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton size="small" variant="outlined" color="success" onClick={settlePark}>
            Pay
          </MDButton>
          <MDButton size="small" variant="outlined" color="error" onClick={closeCheckOut}>
            Cancel
          </MDButton>
        </DialogActions>
      </Dialog>
    </div>
  );

  // Toby; set notification bar
  const notification = (
    <Snackbar open={notif} autoHideDuration={5000} onClose={() => setNotif(false)}>
      <MuiAlert
        onClose={() => setNotif(false)}
        elevation={6}
        variant="filled"
        severity={msgType}
        sx={{ width: "100%" }}
      >
        {msgType.toUpperCase()}!
      </MuiAlert>
    </Snackbar>
  );

  const menuItem = menuItems.map((id) => (
    <MenuItem onClick={() => menuItemsOnClick(id)} key={id}>
      Parking Lot {id}
    </MenuItem>
  ));

  // Toby; render Menu
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

  // Toby; render user info
  const renderUser = (
    <div style={{ margin: "15px 0 0 15px" }}>
      <p>
        <b>Name:</b> {first} {mid === null ? "" : mid.toUpperCase()} {last}
      </p>
      <p>
        <b>Date of Birth:</b> {dob}
      </p>
      <p>
        <b>License Number:</b> {license}
      </p>
      <p>
        <b>Default Phone Number:</b> {phone1}
      </p>
      <p>
        <b>Alternative Phone Number:</b> {phone2}
      </p>
    </div>
  );

  // Toby; render parking
  const renderParking = (
    <div style={{ margin: "15px 0 0 15px" }}>
      <p>
        <b>Parking Lot:</b> {title}
      </p>
      <p>
        <b>Vehicle Plate Number:</b> {plate}
      </p>
      <p>
        <b>Vehicle Type:</b> {vType}
      </p>
      <p>
        <b>Height:</b> {height > 0 ? [height, "ft"].join(" ") : "NA"}
      </p>
    </div>
  );

  // Toby; render parked vehicle info
  const renderParked = (
    <div style={{ margin: "15px 0 0 15px" }}>
      <p>
        <b>Parking Lot:</b> {parked.lot}
      </p>
      <p>
        <b>Space Number:</b> {parked.space}
      </p>
      <p>
        <b>Vehicle Plate Number:</b> {parked.plate}
      </p>
      <p>
        <b>Checkin Datetime:</b> {parked.time}
      </p>
    </div>
  );

  // Toby; render alert
  const renderAlert = (
    <div>
      <Dialog
        open={alertx === 1}
        onClose={() => setAlert(0)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title"> Non-existent User! </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            No registered user with the same license number and/or date of birth. <br />
            Do you want to register as a new user with following information?
          </DialogContentText>
          {renderUser}
        </DialogContent>
        <DialogActions>
          <MDButton size="small" variant="outlined" color="success" onClick={registerNewUser}>
            Yes
          </MDButton>
          <MDButton size="small" variant="outlined" color="error" onClick={() => setAlert(0)}>
            Cancel
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={alertx === 2}
        onClose={() => setAlert(0)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title2"> Welcome Back! </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description2">
            Hello {first}. Please confirm if the following information is correct.
          </DialogContentText>
          {renderUser}
        </DialogContent>
        <DialogActions>
          <MDButton
            size="small"
            variant="outlined"
            color="success"
            onClick={() => opAlertDialog(0, 2)}
          >
            Confirm
          </MDButton>
          <MDButton size="small" variant="outlined" color="error" onClick={() => setAlert(0)}>
            Cancel
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={alertx === 3}
        onClose={() => setAlert(0)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title3"> Parking Details </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description3">
            Please confirm the parking information is correct.
          </DialogContentText>
          {renderParking}
        </DialogContent>
        <DialogActions>
          <MDButton size="small" variant="outlined" color="success" onClick={parking}>
            Park
          </MDButton>
          <MDButton size="small" variant="outlined" color="error" onClick={() => setAlert(0)}>
            Cancel
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={alertx === 4}
        onClose={() => setAlert(0)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title4"> Parking Fails </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description4">
            The vehicle has already been parked. <br />
            Please refer to the parking information below.
          </DialogContentText>
          {renderParked}
        </DialogContent>
        <DialogActions>
          <MDButton size="small" variant="outlined" color="info" onClick={() => setAlert(0)}>
            Okay
          </MDButton>
        </DialogActions>
      </Dialog>
    </div>
  );

  // Toby; render dialog
  const renderDialog = (
    <div>
      <Dialog open={dialogOpen === 1} onClose={closeDialog} component="form" onSubmit={submitForm}>
        <DialogTitle>User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the following information to confirm your identity.
          </DialogContentText>
          <MDBox
            sx={{
              "& .MuiTextField-root": { m: 1, width: "28ch" },
            }}
          >
            <TextField
              required
              id="last"
              label="Last Name"
              onChange={(e) => setLast(e.target.value)}
              error={last.length === 0}
            />
            <TextField
              required
              id="first"
              label="First Name"
              onChange={(e) => setFirst(e.target.value)}
              error={first.length === 0}
            />
            <TextField id="mid" label="Mid Init." onChange={(e) => setMid(e.target.value)} />
            <TextField
              required
              id="dob"
              label="Date of brith"
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setDob(e.target.value)}
              error={dob.length === 0}
            />
            <TextField
              required
              id="phone1"
              label="Phone #"
              onChange={(e) => setPhone1(e.target.value)}
              error={phone1.length === 0}
            />
            <TextField
              id="phone2"
              label="Alternative Phone #"
              onChange={(e) => setPhone2(e.target.value)}
            />
            <TextField
              required
              id="license"
              label="Driving License #"
              onChange={(e) => setLicense(e.target.value)}
              error={license.length === 0}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton size="small" variant="outlined" color="success" type="submit">
            Confirm
          </MDButton>
          <MDButton size="small" variant="outlined" color="error" onClick={closeDialog}>
            Cancel
          </MDButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={dialogOpen === 2}
        onClose={closeDialog}
        component="form"
        onSubmit={submitFormVehicle}
      >
        <DialogTitle>Vehicle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter information of the vehicle that you will park here.
          </DialogContentText>
          <MDBox
            sx={{
              "& .MuiTextField-root": { m: 2, width: "30ch" },
            }}
          >
            <TextField
              required
              id="plate"
              label="Plate #"
              variant="standard"
              onChange={(e) => setPlate(e.target.value)}
              error={plate.length === 0}
            />
            <TextField
              required
              select
              id="type"
              label="Vihecle Type"
              variant="standard"
              value={vType}
              onChange={(e) => {
                setVType(e.target.value);
                if (e.target.value !== "Truck") {
                  setHeight(0);
                }
              }}
              helperText="Please select your vehicle type"
              error={vType.length === 0}
            >
              {vehicleTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required={vType === "Truck"}
              disabled={vType !== "Truck"}
              id="height"
              label="Height"
              type="number"
              variant="standard"
              value={height}
              InputProps={{ endAdornment: <InputAdornment position="end">ft</InputAdornment> }}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setHeight(e.target.value)}
              error={vType === "Truck" && height <= 0}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton size="small" variant="outlined" color="success" type="submit">
            Confirm
          </MDButton>
          <MDButton size="small" variant="outlined" color="error" onClick={closeDialog}>
            Cancel
          </MDButton>
        </DialogActions>
      </Dialog>
    </div>
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
                  table={{ columns: tableHeaders, rows: table }}
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
      {renderDialog}
      {renderAlert}
      {renderCheckOut}
      <Footer />
      {notification}
    </DashboardLayout>
  );
}

export default LotTables;
