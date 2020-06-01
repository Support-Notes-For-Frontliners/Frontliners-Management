import React from "react";
import "./App.css";
import NavBar from "./assets/components/NavBar";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./Dashboard.js";
import Login from "./Login.js";
// import About from "./About.js"
// import Home from "./Home"
// import Note from "./Note"
// import Gallery from "./Gallery"

function App() {
  return (
    <>
      {/* <NavBar /> */}
      <Switch>
        {/* <Route component={Home} path="/" exact={true}/>
        <Route component={Note} path="/note" />
        <Route component={About} path = "/about" />
        <Route component={Gallery} path = "/gallery"/> */}
        <Route component={Login} path="/login" />
        <Route component={Dashboard} path="/dashboard" />
      </Switch>
    </>
  );
}

export default App;
