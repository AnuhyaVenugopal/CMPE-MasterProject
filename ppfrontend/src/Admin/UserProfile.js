import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
export default function UserProfile() {
  const [reviewsList, setreviewsList] = useState([1, 2.5, 3, 4, 5, 6, 7]);
  const user = useSelector((store) => store.verificationDetails.selected);
  return (
    <div style={styles.container}>
      <div style={styles.profile}>
        <div style={styles.image}>
          <Avatar
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
            sx={{ width: 170, height: 170 }}
          />
        </div>
        <div style={styles.details}>
          <div style={styles.row}>
            <label style={styles.labels}>First Name</label>
            <Typography sx={{ paddingLeft: "3%" }}>{user.firstname}</Typography>
          </div>
          <div style={styles.row}>
            <label style={styles.labels}>Last Name</label>
            <Typography sx={{ paddingLeft: "3%" }}>{user.lastname}</Typography>
          </div>
          <div style={styles.row}>
            <label style={styles.labels}>Mobile</label>
            <Typography sx={{ paddingLeft: "3%" }}>{user.mobile}</Typography>
          </div>
          <div style={styles.row}>
            <label style={styles.labels}>Email</label>
            <Typography sx={{ paddingLeft: "3%" }}>{user.email}</Typography>
          </div>
          <div style={styles.row}>
            <label style={styles.labels}>City</label>
            <Typography sx={{ paddingLeft: "3%" }}>{user.city}</Typography>
          </div>
          <div style={styles.row}>
            <label style={styles.labels}>State</label>
            <Typography sx={{ paddingLeft: "3%" }}>{user.state}</Typography>
          </div>
          <div style={styles.row}>
            <label style={styles.labels}>Date of Birth</label>
            <Typography sx={{ paddingLeft: "3%" }}>{user.dob}</Typography>
          </div>
          <div style={styles.row}>
            <label style={styles.labels}>Interests</label>
            <Typography sx={{ paddingLeft: "3%" }}>
              {`${user.interests1} , ${user.interests2},${user.interests3}`}
            </Typography>
          </div>
          <div style={styles.row}>
            <label style={styles.labels}>Date Registered</label>
            <Typography sx={{ paddingLeft: "3%" }}>
              {user.registeddate}
            </Typography>
          </div>
        </div>
      </div>
      <div style={styles.experiences}>
        <Typography variant={"h6"}>Experiences</Typography>
        <Typography variant="body1">{user.experiences}</Typography>
      </div>
      <div style={styles.reviews}>
        <Typography
          variant={"h6"}
          sx={{ display: "flex", alignSelf: "flex-start" }}
        >
          Reviews
        </Typography>
        {reviewsList.map((review) => {
          return (
            <Card sx={{ width: "75%", margin: "1%" }} elevation={3}>
              <CardContent>
                <Rating
                  name="read-only"
                  value={review}
                  readOnly
                  precision={0.5}
                />
                <Typography variant="h5" component="div"></Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Shim Nyugen
                </Typography>
                <Typography variant="body2">
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
const styles = {
  container: { display: "flex", flexDirection: "column" },
  profile: { display: "flex", flexDirection: "row", flex: 1 },
  image: { display: "flex", flex: 1 },
  details: { display: "flex", flexDirection: "column", flex: 3 },
  row: { display: "flex", flexDirection: "row" },
  labels: { display: "inlineBlock", width: "140px", textAlign: "right" },
  reviews: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  experiences: {},
};
