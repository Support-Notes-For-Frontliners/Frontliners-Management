import React from "react";
import {
  Paper,
  Typography,
  makeStyles,
  Button,
  TextField,
  Grid,
  FormControl,
} from "@material-ui/core";
import Center from "react-center";
import { Redirect } from "react-router-dom";
import FirebaseContext from "./assets/components/FireBase/FireBaseContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",
    width: "100%",
    // justifyContent: "center",
    // alignItems: "center",
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    margin: 0,
  },
  paper: {
    // padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    // alignItems: "center",
    width: 300,
    padding: 20,
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: 20,
    background: "linear-gradient(135deg, #FE6B8B 40%, #FF8E53 90%)",
  },
  item: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  },
}));

export default function Login(props) {
  function login(target, firebase) {
    console.log(target.email.value, target.password.value);
    console.log(firebase);
    firebase.auth
      .signInWithEmailAndPassword(target.email.value, target.password.value)
      .catch(function (error) {
        console.log(error);
        alert(
          "Error with signin, incorrect username/password or acct does not exist"
        );
      });
  }
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FirebaseContext.Consumer>
        {(firebase) => (
          <Center>
            {firebase.auth.currentUser ? (
              <Redirect push to="/dashboard" />
            ) : (
              <Paper elevation={10} className={classes.paper}>
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={(e) => {
                    e.preventDefault();
                    login(e.target, firebase);
                  }}
                >
                  <Grid
                    container
                    direction="column"
                    className={classes.grid}
                    spacing={3}
                  >
                    <Grid item className={classes.item} direction="column">
                      <Typography variant="h4">Management Portal</Typography>
                      <Typography>Notes for Frontliners</Typography>
                    </Grid>

                    <Grid
                      item
                      className={classes.item}
                      style={{ width: "90%", alignItems: "center" }}
                    >
                      <FormControl>
                        <TextField
                          id="email"
                          type="email"
                          label="Email"
                          required
                        />
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      className={classes.item}
                      style={{ width: "90%", alignItems: "center" }}
                    >
                      <FormControl>
                        <TextField
                          id="password"
                          type="password"
                          label="Password"
                          required
                        />
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      className={classes.item}
                      //   style={{ width: "90%", alignItems: "center" }}
                    >
                      <Button type="submit" style={{ fontSize: 20 }}>
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            )}
          </Center>
        )}
      </FirebaseContext.Consumer>
    </div>
  );
}
