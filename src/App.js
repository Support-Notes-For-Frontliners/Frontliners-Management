import React from "react";
import "./App.css";
import NavBar from "./assets/components/NavBar";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./Login.js";
import Dashboard from "./Dashboard.js";
import FirebaseContext from "./assets/components/FireBase/FireBaseContext";
import "firebase/auth";
import app from "firebase/app";
// import About from "./About.js"
// import Home from "./Home"
// import Note from "./Note"
// import Gallery from "./Gallery"

function App() {
  const [user, setUser] = React.useState(null);
  const [redirect, setRedirect] = React.useState(null);
  setTimeout(function () {
    setRedirect(<Redirect to="/login" />);
  }, 1000);
  app.auth().onAuthStateChanged(function (user) {
    setUser(user);
  });
  return (
    <Switch>
      {/* <Route component={Home} path="/" exact={true}/>
        <Route component={Note} path="/note" />
        <Route component={About} path = "/about" />
        <Route component={Gallery} path = "/gallery"/> */}
      <Route component={Login} path="/login" />
      {user == null ? (
        <div>
          Attempting authentication...
          {redirect}
        </div>
      ) : (
        <>
          <Route component={Dashboard} path="/dashboard" />
        </>
      )}
    </Switch>
  );
}

export default App;
