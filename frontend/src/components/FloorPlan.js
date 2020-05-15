import React, { Component } from 'react';
import {Map} from 'immutable';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
 
//download this demo catalog https://github.com/cvdlab/react-planner/tree/master/demo/src/catalog
import MyCatalog from './catalog/mycatalog';
 
import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlanner,
  Plugins as PlannerPlugins,
} from 'react-planner';

//define state
  let AppState = Map({
    'react-planner': new PlannerModels.State()
  });
   
  //define reducer
  let reducer = (state, action) => {
    state = state || AppState;
    state = state.update('react-planner', plannerState => PlannerReducer(plannerState, action));
    return state;
  };
   
  let store = createStore(reducer, null, window.devToolsExtension ? window.devToolsExtension() : f => f);
   
  let plugins = [
    PlannerPlugins.Keyboard(),
    PlannerPlugins.Autosave('react-planner_v0'),
    PlannerPlugins.ConsoleDebugger(),
  ];

class FloorPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <div>
          <Provider store={store}>
            <ReactPlanner
              isAdmin={this.props.isAdmin}
              catalog={MyCatalog}
              width={1400}
              height={600}
              stateExtractor={state => state.get('react-planner')}
            />
          </Provider>
        </div>
    );
  }
}
export default FloorPlan;