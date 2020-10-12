import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles, ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { Switch, FormControlLabel, TableSortLabel, Checkbox, Grid, Button, Typography } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";

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
  buttonContainer: {
    flexGrow: 1,
  },
}));

const buttonTheme = createMuiTheme({
  palette: {
    primary: {
      main: green[200],
    },
    secondary: {
      main: red[200],
    },
  }
})

// const sortObject = (obj) =>
//   Object.keys(obj)
//     .sort()
//     .reduce((res, key) => ((res[key] = obj[key]), res), {});


export default function Orders(props) {
  const [noteData, setNoteData] = React.useState({});
  const [notesTable, setNotesTable] = React.useState([]);

  const [orderCat, setOrderCat] = React.useState("approved");
  const [order, setOrder] = React.useState(false);
  const [update, setUpdate] = React.useState(true);

  const [selectedNotes, setSelectedNotes] = React.useState([])
  const [selectedNotesNum, setSelectedNotesNum] = React.useState(0)

  const classes = useStyles();

  React.useEffect(() => {
    getData(getDataRef(orderCat));
  }, []);
  function gotStatData(data) {
    data = data.val();
    // setNoteData({ ...data, ...noteData });
    setNoteData(data)
    
    setNotesTableWrapper(data)
  }
  function errData(err) {
    console.log("Error!");
    console.log(err);
  }

  function getDataRef(approval) {
    return props.firebase.db
      .ref("formData")
      // .orderByChild(orderCat)
      // .equalTo(approval)
      .limitToLast(40);
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
  // const switchApproval = (event) => {
  //   console.log(event.target.checked);
  //   setApproved(event.target.checked);
  //   if (
  //     Object.keys(
  //       Object.filter(
  //         noteData,
  //         (approve) => event.target.checked == approve.approved
  //       )
  //     ).length === 0
  //   ) {
  //     getData(getDataRef(event.target.checked));
  //   }
  // };

  function onSelected(event, noteId, checked){
    // const checked = event.target.checked;
    // console.log(noteId);
    
    const idxNote = selectedNotes.indexOf(noteId)
    if (checked){
      if (idxNote == -1){
        selectedNotes.push(noteId);
      }
    }
    else if (idxNote > -1){
      selectedNotes.splice(idxNote, 1);
    }
    setSelectedNotes(selectedNotes);
    setSelectedNotesNum(selectedNotes.length);
    // console.log(selectedNotes)
  }
  function onUnselectAll(){
    setSelectedNotes([]);
    setSelectedNotesNum(0);
    setNotesTableWrapper(noteData)
  }

  function onChangeNoteStatus(stateType, state){
    var newData = {}
    for (var note of selectedNotes){
      newData[note] = {...noteData[note], [stateType]: state}
    }
    console.log(newData)

    // props.firebase.db.ref("formData").set(newData)
  }

  const sortNoteData = ((a, b, attr, order, data) =>
    order
      ? data[a][attr] > data[b][attr]
        ? -1
        : 1
      : data[a][attr] > data[b][attr]
      ? 1
      : -1
  )

  function setNotesTableWrapper(data, orderCategory=orderCat, orderDir=order){
    console.log("setNotesTableWrapper ORDER:", order, "CATEGORY:", orderCat)
    console.log("setNoteTableWrapper DATA:", data)
    setNotesTable(Object.keys(data)
      .sort((a, b) => sortNoteData(a,b,orderCategory,orderDir, data))
      .map((id) => (
        <Note noteData={data[id]} id={id} onChange={onSelected} key={data, id} isChecked={selectedNotes} update={update}/>
    )));
    // console.log(notesTable)
    setUpdate(false);
  }

  console.log("main method NOTEDATA:" , noteData)

  return (
    <React.Fragment>
      <Title>Recent Notes</Title>

      <ThemeProvider theme={buttonTheme}>
        <Grid container spacing={2}>
          <Grid item><Button variant="contained" color="primary" onClick={()=>onChangeNoteStatus("approved", true)}>Approve</Button></Grid>
          <Grid item><Button variant="contained" color="secondary" onClick={()=>onChangeNoteStatus("approved", false)}>Unapprove</Button></Grid>
          <Grid item><div/></Grid>
          <Grid item><Button variant="contained" color="primary" onClick={()=>onChangeNoteStatus("sent", true)}>Send</Button></Grid>
          <Grid item><Button variant="contained" color="secondary" onClick={()=>onChangeNoteStatus("sent", false)}>Unsend</Button></Grid>
          <Grid item><div/></Grid>
          <Grid item><Button variant="contained" color="grey" onClick={()=>onUnselectAll()}>Unselect All</Button></Grid>

          <Grid item><Typography variant="subtitle1" style={{color:"#555"}}>{selectedNotesNum > 0? selectedNotesNum + " Notes Selected" : ""}</Typography></Grid>
        </Grid>
      </ThemeProvider>

      {/* <FormControlLabel
        control={<Switch checked={approved} onChange={switchApproval} />}
        label={approved ? "Approved" : "Non Approved"}
      /> */}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>Where To</TableCell>
            {/* <TableCell>Approved</TableCell> */}
            <TableCell>
              <TableSortLabel
                active={orderCat === "approved"}
                direction={order ? "asc" : "desc"}
                onClick={() => {
                  console.log('approved order: '+ !order);
                  setOrder(!order);
                  setOrderCat("approved");
                  setNotesTableWrapper(noteData, "approved", !order);
                }}
              >
                Approved
                {
                  // for debugging purposes
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                }
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderCat === "sent"}
                direction={order ? "asc" : "desc"}
                onClick={() => {
                  console.log('sent order: '+ !order);
                  setOrder(!order);
                  setOrderCat("sent");
                  setNotesTableWrapper(noteData, "sent", !order);
                }}
              >
                Sent
                {
                  // for debugging purposes
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
          {/* {Object.keys(noteData)
            .sort((a, b) => sortNoteData(a,b,orderCat,order))
            .map((id) => (
              <Note noteData={noteData[id]} id={id} onChange={onSelected} key={noteData, id} isChecked={selectedNotes.indexOf(id) >= 0}/>
            ))} */}
          {notesTable}
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


function Note(props){
  const noteData = props.noteData;
  const id = props.id;
  const isChecked = props.isChecked;

  const [update, setUpdate] = React.useState(true)

  // console.log("NOTE UPDATING!!")

  // () => selectedNotes.indexOf(id) >= 0
  return (
    <TableRow>
      <TableCell><Checkbox onChange={(event) => {props.onChange(event, id, !(isChecked.includes(id))); setUpdate(!update)}}  checked={isChecked.includes(id)}/></TableCell>
      <TableCell>{noteData.facility}</TableCell>
      {/* <TableCell>{noteData[id].approved.toString()}</TableCell> */}
      <TableCell>{noteData.approved ? "✔️" : "❌"}</TableCell>
      <TableCell>{noteData.sent ? "✔️" : "❌"}</TableCell>
      <TableCell>{noteData.sender}</TableCell>
      <TableCell align="right">{noteData.note}</TableCell>
    </TableRow>
  );
}