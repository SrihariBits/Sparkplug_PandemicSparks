import React, { Component } from 'react';
import Square from './components/Square';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div id="main">
        <Square Id="A" latlng={{latitude:0.0,longitude:0.0}} size={{width:'3%',height:'3%'}} colour="#db3e00"/>
        <Square Id="B" latlng={{latitude:0.0,longitude:0.0}} size={{width:'3%',height:'3%'}} colour="#ba68c8"/>
        <Square Id="C" latlng={{latitude:0.0,longitude:0.0}} size={{width:'3%',height:'3%'}} colour="#ff8a65"/>
      </div>
    );
  }
}

export default App;
