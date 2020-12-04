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


// const sortObject = (obj) =>
//   Object.keys(obj)
//     .sort()
//     .reduce((res, key) => ((res[key] = obj[key]), res), {});

// input: a function to call when the selected notes change
// output: a list of currently selected notes, a function to set the notes (setSelectedNotes())
function useSelected(onChangeCallback){
  const [selectedNotes, setSelectedNotes] = React.useState([]);
  
  function retFunc(noteId){
    console.log(noteId);
    setSelectedNotes([...selectedNotes, noteId])
  }

  React.useEffect(()=>{
    onChangeCallback();
  }, [selectedNotes, retFunc]);

  return [selectedNotes, retFunc];
}


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
  const [noteData, setNoteData] = React.useState([]);
  
  // notes component
  const [notesTable, setNotesTable] = React.useState([]);

  // what to sort by
  const [orderCat, setOrderCat] = React.useState("approved");

  // up or down
  const [order, setOrder] = React.useState(false);

  // if the note table needs to be updates
  const [update, setUpdate] = React.useState(true);

  // Selected notes ids and length
  const [selectedNotes, setSelectedNotes] = React.useState([])
  const [selectedNotesNum, setSelectedNotesNum] = React.useState(0)

  const classes = useStyles();

  React.useEffect(() => {
    getData(getDataRef(orderCat));
  }, []);
  function gotStatData(data) {
    data = data.val();
    // setNoteData({ ...data, ...noteData });
    var dataArray = []
    Object.keys(data).forEach(id => {
      dataArray.push({id: id, ...data[id]});
    })
    console.log(dataArray)
    setNoteData(dataArray)
    
    // setNotesTableWrapper(data)
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
  //stat that stored the checkmarks for each components [t, f, t, t, f]
  //dictionary: each key would be the note id, each item would be a true/false. maybe only keep the ones that have been changed as well. 


  console.log("main method NOTEDATA:" , noteData)
  console.log("main method NOTETABLE:", notesTable)
  console.log("main method SELECTEDNOTES", selections)

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
              {/* <Grid item><Button variant="contained" color="grey" onClick={handleClearAll}>Unselect All</Button></Grid> */}
              <Grid item><Typography variant="subtitle1" style={{color:"#555"}}>{selectedCount > 0? selectedCount + " Notes Selected" : ""}</Typography></Grid>
            </Grid>
          </ThemeProvider>

          {/* {!areAnySelected && <span>Select items in the table below</span>}
          <div style={{ visibility: areAnySelected ? 'visible' : 'hidden' }}>
            <span style={{marginRight: '8px'}}>{selectedCount} selected</span>
            <Button basic onClick={handleClearAll}>Clear</Button>
          </div>
          <div>
            <span>{items.length} Members</span>
          </div> */}
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
                    console.log('approved order: '+ !order);
                    setOrderCat("approved");
                    setOrder(!order);
                    // setNotesTableWrapper(noteData, "approved", !order);
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
                    // setNotesTableWrapper(noteData, "sent", !order);
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


      {/* <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>Where To</TableCell>
            {/* <TableCell>Approved</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderCat === "approved"}
                direction={order ? "asc" : "desc"}
                onClick={() => {
                  console.log('approved order: '+ !order);
                  setOrderCat("approved");
                  setOrder(!order);
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
            ))} *
          {notesTable}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div> */}
    </React.Fragment>
  );
})


// function Note(props){
//   const noteData = props.noteData;
//   const id = props.id;
//   const isChecked = props.isChecked;

//   // const [update, setUpdate] = React.useState(true)

//   const [selectedNotes, setSelectedNotes] = useSelected(function(){})
//   console.log(selectedNotes)

//   // console.log("NOTE UPDATING!!")

//   // () => selectedNotes.indexOf(id) >= 0
//   return (
//     <TableRow>
//       <TableCell><Checkbox onChange={(event) => {setSelectedNotes(id)}}  checked={selectedNotes.includes(id)}/></TableCell>
//       <TableCell>{noteData.facility}</TableCell>
//       {/* <TableCell>{noteData[id].approved.toString()}</TableCell> */}
//       <TableCell>{noteData.approved ? "✔️" : "❌"}</TableCell>
//       <TableCell>{noteData.sent ? "✔️" : "❌"}</TableCell>
//       <TableCell>{noteData.sender}</TableCell>
//       <TableCell align="right">{noteData.note}</TableCell>
//     </TableRow>
//   );
// }


function Note(props){
  const noteData = props.noteData;
  const id = props.id;
  const [something, setSomething] = React.useState(0);
  var isChecked = props.isChecked;
  // const [isChecked, setIsChecked] = React.useState(props.isChecked);
  const [update, setUpdate] = React.useState(true)

  console.log("NOTE UPDATING:", isChecked)

  function onChangeCallback(event){
    props.onChange(event, id, !(isChecked.includes(id))); 
    setUpdate(!update);
    setSomething(something + 1);
    console.log("Check box on change was called with", something+1)
    console.log("Check box ", id, isChecked.includes(id))
  }

  // () => selectedNotes.indexOf(id) >= 0
  return (
    <TableRow>
      <TableCell><Checkbox onChange={onChangeCallback}  checked={isChecked.includes(id)}/></TableCell>
      <TableCell>{noteData.facility}</TableCell>
      {/* <TableCell>{noteData[id].approved.toString()}</TableCell> */}
      <TableCell>{noteData.approved ? "✔️" : "❌"}</TableCell>
      <TableCell>{noteData.sent ? "✔️" : "❌"}</TableCell>
      <TableCell>{noteData.sender}</TableCell>
      <TableCell align="right">{noteData.note}</TableCell>
    </TableRow>
  );
}