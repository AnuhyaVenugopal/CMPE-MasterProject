import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../NavBar";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { resetSaveStatus, saveNewBooking } from "../reduxSlices/BookingsSlice";
import { unwrapResult } from "@reduxjs/toolkit";
export default function UserBooking() {
  const venue = useSelector((state) => state.venues.venueDetailsById);
  const [noOfCourts, setnoOfCourts] = useState(1);
  const [date, setdate] = useState(dayjs());
  const [slots, setslots] = useState([]);
  const [price, setprice] = useState(0);
  const [snackbar, setsnackbar] = useState(false);
  const navigate = useNavigate();
  const userId = JSON.parse(sessionStorage.getItem("details"))?.id || 0;
  const dispatch = useDispatch();
  const saveStatus = useSelector((state) => state.bookings.saveBookingStatus);

  useEffect(() => {
    generateSlots(venue.startTime, venue.endTime, date);
  }, [venue, date]);
  const handleSlotSelection = (slot) => {
    let idx = slots.map((x) => x.id).indexOf(slot.id);
    console.log("index", idx);
    let newSlots = slots;
    newSlots[idx].selected = !newSlots[idx].selected;
    setslots((old) => [...newSlots]);
  };
  useEffect(() => {
    setprice(
      slots.filter((x) => x.selected == true).length *
        venue.pricePerHour *
        noOfCourts
    );
  }, [venue, slots, noOfCourts]);

  const handleSnackBarClose = (event, reason) => {
    setsnackbar(false);
  };
  const handleClose = () => {
    if (saveStatus.isSaveDone) navigate("/user/bookings");
    else navigate(-1);
    dispatch(resetSaveStatus());
  };
  const generateSlots = (start, end) => {
    let res = [];

    start = dayjs(start, "h:mm:ss A")
      .set("date", date.date())
      .set("month", date.month())
      .set("year", date.year());

    if (dayjs().isAfter(start)) {
      start = start.set("hour", dayjs().hour() + 1);
    }
    end = dayjs(end, "h:mm:ss A")
      .set("date", date.date())
      .set("month", date.month())
      .set("year", date.year());
    let len = end.diff(start, "hour");
    for (let i = 0; i < len; i++) {
      let slotStart = start.add(i, "hour");
      let slotEnd = start.add(i + 1, "hour");
      let data = { id: i, slots: [slotStart, slotEnd], selected: false };
      res.push(data);
      setslots(res);
    }
  };
  const handleCancel = () => {
    navigate(`/user/venue/${venue.id}/details`);
  };
  const handleConfirm = async () => {
    let selectedSlots = slots
      .filter((x) => x.selected == true)
      .map((x) => x.slots);
    let data = {
      venueId: venue.id,
      userId: userId,
      noOfCourts,
      slots: selectedSlots,
      price: price,
      bookingTime: dayjs(),
    };
    console.log(data);
    if (noOfCourts > 0 && selectedSlots.length > 0)
      dispatch(saveNewBooking(data));
    else setsnackbar(true);
  };
  useEffect(() => {
    // saveStatus.is;
  }, [saveStatus]);

  const SlotsList = (
    <div className="slots" style={{ display: "flex", flexWrap: "wrap" }}>
      {slots.map((x) => {
        return (
          <Card
            style={{ flexBasis: "30%", margin: "1%" }}
            elevation={8}
            key={x.id}
            onClick={() => handleSlotSelection(x)}
          >
            <CardContent
              style={
                x.selected
                  ? {
                      background:
                        "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                    }
                  : {}
              }
            >
              <Typography color={x.selected ? "white" : "black"}>
                {" "}
                {`${x.slots[0].format("hh:mm A")} - ${x.slots[1].format(
                  "hh:mm A"
                )}`}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
  const details = (
    <div style={styles.details}>
      <div style={styles.row}>
        <labels style={styles.labels}>VENUE NAME</labels>
        <Typography sx={{ paddingLeft: "3%", textAlign: "left" }}>
          {venue.venuename?.toUpperCase()}
        </Typography>
      </div>
      <div style={styles.row}>
        <label style={styles.labels}>VENUE ADDRESS</label>
        <Typography sx={{ paddingLeft: "3%", textAlign: "left" }}>
          {venue.address.toUpperCase()}
        </Typography>
      </div>
      <div style={styles.row}>
        <label
          style={{
            display: "inlineBlock",
            width: "250px",
            textAlign: "right",
            fontWeight: "bold",
            paddingTop: "1%",
          }}
        >
          Select No Of Courts
        </label>
        <div
          style={{
            paddingLeft: "3%",
            flexDirection: "row",
            display: "flex",
          }}
        >
          <IconButton
            onClick={() =>
              noOfCourts > 0 ? setnoOfCourts(noOfCourts - 1) : ""
            }
          >
            <RemoveCircleOutlineOutlinedIcon fontSize="medium" />
          </IconButton>
          <Typography padding={"10%"}>{noOfCourts}</Typography>
          <IconButton
            onClick={() =>
              noOfCourts == venue.noofcourts
                ? ""
                : setnoOfCourts(noOfCourts + 1)
            }
          >
            <ControlPointOutlinedIcon fontSize="medium" />
          </IconButton>
        </div>
      </div>
    </div>
  );
  const dateSelection = (
    <div style={{ display: "flex", flexDirection: "row", marginBottom: "1%" }}>
      {/* <label style={styles.labels}>DATE</label> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          // onChange={formik.handleChange}
          onChange={(value) => setdate(value)}
          value={date}
          disablePast
          maxDate={dayjs().add(30, "days")}
          renderInput={(params) => (
            <TextField
              {...params}
              style={{
                marginTop: "2%",
                width: "100%",
              }}
              name="startTime"
              id="sd"
              label="DATE"
            />
          )}
        />
      </LocalizationProvider>
    </div>
  );
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 2 }}>
        <NavBar />
      </div>
      <div
        className="main-container"
        style={{
          border: "solid",
          display: "flex",
          justifyContent: "center",
          //   alignItems: "center",
          alignContent: "center",
          flexDirection: "column",
          flex: 50,
        }}
      >
        <Card
          sx={{
            width: 1000,
            alignSelf: "center",
            maxHeight: "80",
            overflow: "auto",
          }}
          elevation={10}
        >
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              style={{ marginBottom: "1%" }}
            >
              BOOKING
            </Typography>
            {details}
            {dateSelection}
            {SlotsList}
            <div
              className="price"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2%",
                marginLeft: "10%",
                marginRight: "10%",
                backgroundColor: "#223D56",
              }}
            >
              <div style={{ display: "flex", margin: "1%" }}>
                <Typography variant="h6" color={"white"}>
                  Total Price :
                </Typography>
                <Typography
                  paddingTop={0.8}
                  paddingLeft={1}
                  paddingRight={1}
                  color={"white"}
                >{` ${slots.filter((x) => x.selected == true).length} Hr x $${
                  venue.pricePerHour
                } x ${noOfCourts} courts= `}</Typography>
                <Typography
                  variant="h6"
                  color={"white"}
                >{`$${price}`}</Typography>
              </div>
            </div>
          </CardContent>
          <CardActions>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <Button style={{ margin: "1%" }} onClick={handleCancel}>
                Cancel
              </Button>
              <Button style={{ margin: "1%" }} onClick={handleConfirm}>
                CONFIRM
              </Button>
            </div>
          </CardActions>
        </Card>
      </div>
      <Dialog
        open={saveStatus.isSaveDone || saveStatus.isSaveHasError}
        onClose={handleClose}
      >
        <DialogTitle>Booking Status</DialogTitle>
        <DialogContent>
          {saveStatus.isSaveDone
            ? "Booking Confirmed"
            : "Oops Something went Wrong Please Try again"}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Okay</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Please select Slots and Court count
        </Alert>
      </Snackbar>
    </div>
  );
}
const styles = {
  details: {
    display: "flex",
    flexDirection: "column",
    flex: 3,
    marginLeft: "20%",
  },
  row: { display: "flex", flexDirection: "row" },
  labels: {
    display: "inlineBlock",
    width: "250px",
    textAlign: "right",
    fontWeight: "bold",
  },
};
