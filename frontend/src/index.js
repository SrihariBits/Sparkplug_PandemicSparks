import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Link, BrowserRouter as Router, Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import * as serviceWorker from './serviceWorker';

import App from './App';
import HomePage from './components/HomePage';
import ErrorPage from './components/ErrorPage';
import AdminPage from './components/AdminPage';
import AssociatePage from './components/AssociatePage';
import CustomerPage from './components/CustomerPage';

const routing = (
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/home" component={HomePage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/associate" component={AssociatePage} />
        <Route path="/customer" component={CustomerPage} />
        <Route component={ErrorPage} />
      </Switch>
    </Router>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
