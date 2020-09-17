import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { Switch, FormControlLabel, TableSortLabel } from "@material-ui/core";

Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter((key) => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const sortObject = (obj) =>
  Object.keys(obj)
    .sort()
    .reduce((res, key) => ((res[key] = obj[key]), res), {});

export default function Orders(props) {
  const [approved, setApproved] = React.useState(false);
  const [noteData, setNoteData] = React.useState({});
  const [order, setOrder] = React.useState(true);
  const classes = useStyles();

  React.useEffect(() => {
    getData(getDataRef(approved));
  }, []);
  function gotStatData(data) {
    data = data.val();
    var temp = {};
    setNoteData({ ...noteData, ...data });
  }
  function errData(err) {
    console.log("Error!");
    console.log(err);
  }

  function getDataRef(approval) {
    return props.firebase.db
      .ref("formData")
      .orderByChild("approved")
      .equalTo(approval)
      .limitToLast(10);
  }
  function opacity() {
    if (Object.keys(noteData).length === 0) {
      return { opacity: "0" };
    } else {
      return { opacity: "1", transition: "all 1s ease" };
    }
  }
  function getData(ref) {
    ref.on("value", gotStatData, errData);
  }
  const switchApproval = (event) => {
    console.log(event.target.checked);
    setApproved(event.target.checked);
    if (
      Object.keys(
        Object.filter(
          noteData,
          (approve) => event.target.checked == approve.approved
        )
      ).length === 0
    ) {
      getData(getDataRef(event.target.checked));
    }
  };
  return (
    <React.Fragment>
      <Title>Recent Notes</Title>
      <FormControlLabel
        control={<Switch checked={approved} onChange={switchApproval} />}
        label={approved ? "Approved" : "Non Approved"}
      />

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Where To</TableCell>
            <TableCell>
              <TableSortLabel
                active={true}
                direction={order ? "asc" : "desc"}
                onClick={() => {
                  setOrder(!order);
                  console.log(order);
                }}
              >
                Sent
                {
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                }
              </TableSortLabel>
            </TableCell>
            <TableCell>Sender</TableCell>
            <TableCell align="right">Note</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={opacity()}>
          {Object.keys(
            Object.filter(noteData, (approve) => approved == approve.approved)
          )
            .sort((a, b) =>
              order
                ? noteData[a].sent > noteData[b].sent
                  ? -1
                  : 1
                : noteData[a].sent > noteData[b].sent
                ? 1
                : -1
            )
            .map((id) => (
              <TableRow key={id}>
                <TableCell>{noteData[id].facility}</TableCell>
                {/* <TableCell>{noteData[id].approved.toString()}</TableCell> */}
                <TableCell>{noteData[id].sent ? "✔️" : "❌"}</TableCell>
                <TableCell>{noteData[id].sender}</TableCell>
                <TableCell align="right">{noteData[id].note}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}
