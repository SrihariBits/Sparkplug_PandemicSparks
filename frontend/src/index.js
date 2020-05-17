import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Link, BrowserRouter as Router, Switch} from "react-router-dom";

import './index.css';
import * as serviceWorker from './serviceWorker';

import App from './App';
import HomePage from './components/HomePage';
import ErrorPage from './components/ErrorPage';

const routing = (
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/home" component={HomePage} />
        <Route component={ErrorPage} />
      </Switch>
    </Router>
  </React.StrictMode>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
