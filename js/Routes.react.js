import React from 'react'
import App from './components/App.react'

import {Route, IndexRedirect, Redirect} from 'react-router'
import {Parse} from 'parse'
import {isClient} from './util'
import _ from 'lodash'
import {makeId} from './util'

export default function getRoutes () {
  return (
    <Route path="/"
           component={App}>
    </Route>
  )
}

function getComponent (component, addedProps = {}) {
  return function (props, context, updater) {
    if (isClient) {
      return React.createElement(component, {...props, ...addedProps});
    } else {
      return (
        <div></div>
      )
    }
  }
}

function requireAuth (nextState, replaceState) {
  if (!isClient) return true;
  if (!Parse.User.current()) {
    replaceState({
      nextPathname: nextState.location.pathname
    }, '/login');
    return true;
  }
  return false;
}

function antiRequireAuth (nextState, replaceState) {
  if (!isClient) return;
  if (Parse.User.current()) {
    replaceState(null, '/profile/' + Parse.User.current().id);
  }
}

