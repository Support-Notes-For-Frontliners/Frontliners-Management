import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits(props) {
  const classes = useStyles();

  const [orgStats, setOrgStats] = React.useState(null);

  const orgStatsRef = props.firebase.db.ref("stats");
  React.useEffect(() => {
    orgStatsRef.on("value", gotStatData, errData);
  }, []);

  function gotStatData(data) {
    setOrgStats(data.val());
  }
  function errData(err) {
    console.log("Error!");
    console.log(err);
  }
  function opacity() {
    if (orgStats === null) {
      return { opacity: "0" };
    } else {
      return { opacity: "1", transition: "all 1s ease" };
    }
  }
  return (
    <React.Fragment>
      <Title>Key Stats</Title>

      <Typography component="p" variant="h4" style={opacity()}>
        {orgStats == null ? "" : orgStats.notes_count} Written
      </Typography>
      <Typography
        color="textSecondary"
        component="p"
        variant="h4"
        // className={classes.depositContext}
        style={opacity()}
      >
        {orgStats == null ? "" : orgStats.sent_count} Sent
      </Typography>
      <Typography
        color="textSecondary"
        // component="p"
        // variant="h4"
        className={classes.depositContext}
        style={opacity()}
      >
        {orgStats == null ? "" : orgStats.facility_count} Facilities
      </Typography>

      {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div> */}
    </React.Fragment>
  );
}
