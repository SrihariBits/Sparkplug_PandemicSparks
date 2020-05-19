import React, { Component } from 'react';
import FloorPlan from './components/FloorPlan';
import {Route, Link, BrowserRouter as Router, Switch} from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div id="main">
        <FloorPlan isAdmin={true}/>
      </div>
    );
  }
}

export default App;
