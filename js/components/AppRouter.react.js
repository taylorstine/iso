import React from 'react'
import {Parse} from 'parse'
import {Router, Redirect} from 'react-router'
import {createHistory} from 'history'
import {isClient} from '../util'
import getRoutes from '../Routes.react'

import {Provider} from 'react-redux'

let firstTrack = false;

const history = createHistory();

const AppRouter = ({store})=> {
  return (
    <Provider {...{store}}>
      <Router
        history={history}
        onUpdate={onUpdate}
      >
        {getRoutes()}
      </Router>
    </Provider>);
}


function onUpdate () {
  if (!firstTrack) {
    firstTrack = true;
  } else {
    ga('set', {
      page: location.pathname,
      location: location.href
    });
    ga('send', 'pageview');
  }
}

AppRouter.displayName = "AppRouter";
AppRouter.propTypes = {
  store: React.PropTypes.shape({
    dispatch: React.PropTypes.func.isRequired,
    getState: React.PropTypes.func.isRequired
  }).isRequired
}
export default AppRouter