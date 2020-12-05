import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles, ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { green, red } from "@material-ui/core/colors";

import { Switch, FormControlLabel, TableSortLabel, Checkbox, Grid, Button, Typography } from "@material-ui/core";
import withSelections from 'react-item-select';
// import OrdersTable from "./OrdersTable";

const items = [{id: 1, name: 'One'}, {id: 2, name: 'Two'}, {id: 3, name: 'Three'}];

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


export default withSelections((props) => {

  const {
    areAllIndeterminate,
    areAllSelected,
    areAnySelected,
    selectedCount,
    handleClearAll,
    handleSelect,
    handleSelectAll,
    isItemSelected,
    selections,
    firebase
  } = props;

  const segmentStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  // Firebase Data
  const [noteData, setNoteData] = React.useState([]); // as an array for the table
  const [noteDataObject, setNoteDataObject] = React.useState({}); //as an object for other purposes

  // what to sort by
  const [orderCat, setOrderCat] = React.useState("approved");

  // up or down
  const [order, setOrder] = React.useState(false);

  const classes = useStyles();

  React.useEffect(() => {
    getData(getDataRef(orderCat));
  }, []);
  function gotStatData(data) {
    data = data.val();

    setNoteDataObject({ ...data, ...noteDataObject });
    
    var dataArray = []
    Object.keys(data).forEach(id => {
      dataArray.push({id: id, ...data[id]});
    })
    // console.log(dataArray)
    setNoteData(dataArray)
  }
  function errData(err) {
    console.log("Error!");
    console.log(err);
  }

  function getDataRef(approval) {
    return firebase.db
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

  function onChangeNoteStatus(stateType, state){
    var newData = {}

    for (var note of Object.keys(selections)){
      newData[note] = {...noteDataObject[note], [stateType]: state}
    }
    console.log(newData)

    // props.firebase.db.ref("formData").set(newData)
  }

  const sortNoteData = ((a, b, attr, order) =>
  order
    ? a[attr] > b[attr]
      ? -1
      : 1
    : a[attr] > b[attr]
    ? 1
    : -1
)

  // console.log("main method NOTEDATA:" , noteData)
  // console.log("main method SELECTEDNOTES", selections)

  return (
    <React.Fragment>
      <Title>Recent Notes</Title>

      <div>
        <div textAlign="left" style={segmentStyle}>

          <ThemeProvider theme={buttonTheme}>
            <Grid container spacing={2} alignItems="center"> 
              <Grid item><Button variant="contained" color="primary" onClick={()=>onChangeNoteStatus("approved", true)}>Approve</Button></Grid>
              <Grid item><Button variant="contained" color="secondary" onClick={()=>onChangeNoteStatus("approved", false)}>Unapprove</Button></Grid>
              <Grid item><div/></Grid>
              <Grid item><Button variant="contained" color="primary" onClick={()=>onChangeNoteStatus("sent", true)}>Send</Button></Grid>
              <Grid item><Button variant="contained" color="secondary" onClick={()=>onChangeNoteStatus("sent", false)}>Unsend</Button></Grid>
              <Grid item><div/></Grid>
              <Grid item><Button onClick={handleClearAll}>Unselect</Button></Grid>
              <Grid item><Typography variant="subtitle1" style={{color:"#555"}}>{selectedCount > 0? selectedCount + " Notes Selected" : ""}</Typography></Grid>
            </Grid>
          </ThemeProvider>
          </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={areAllSelected(noteData)}
                      indeterminate={areAllIndeterminate(noteData)}
                      onChange={() => handleSelectAll(noteData)}
                    />
                  </TableCell>
                  {/* <TableCell>USERNAME</TableCell>
                  <TableCell>FIRST</TableCell>
                  <TableCell>LAST</TableCell> */}
                  <TableCell>Where To</TableCell>
                  {/* <TableCell>Approved</TableCell> */}
                  <TableCell>
                    <TableSortLabel
                      active={orderCat === "approved"}
                      direction={order ? "asc" : "desc"}
                      onClick={() => {
                        // console.log('approved order: '+ !order);
                        setOrderCat("approved");
                        setOrder(!order);
                        setNoteData(noteData.sort((a,b) => sortNoteData(a,b,"approved",!order)))
                      }}
                    >
                      Approved
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderCat === "sent"}
                      direction={order ? "asc" : "desc"}
                      onClick={() => {
                        // console.log('sent order: '+ !order);
                        setOrder(!order);
                        setOrderCat("sent");
                        setNoteData(noteData.sort((a,b) => sortNoteData(a,b,"sent",!order)))
                      }}
                    >
                      Sent
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Sender</TableCell>
                  <TableCell align="right">Note</TableCell>
                </TableRow>
              </TableHead>


              <TableBody>
                {noteData.map(note => (
                  <TableRow key={note.id}>
                    <TableCell>
                      <Checkbox
                        checked={isItemSelected(note.id)}
                        onChange={() => handleSelect(note.id)}
                      />
                    </TableCell>
                    <TableCell>{note.facility}</TableCell>
                    <TableCell>{note.approved ? "✔️" : "❌"}</TableCell>
                    <TableCell>{note.sent ? "✔️" : "❌"}</TableCell>
                    <TableCell>{note.sender}</TableCell>
                    <TableCell align="right">{note.note}</TableCell>

                  </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  );
})

