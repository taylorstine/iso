import React from 'react'
import {render} from 'react-dom'
import AppRouter from './components/AppRouter.react'
import init from './lib/Initialize'
import {isClient, onWebComponentsReady} from './util'
import configureStore from './redux/configure-store'
import {Map} from 'immutable'


const store = configureStore(new Map());
init(store);
onWebComponentsReady(renderPage);
function renderPage() {
  render(
    <AppRouter {...{store}}/>,
    document.getElementById('root')
  );
}

