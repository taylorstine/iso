import React from 'react'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import {renderToString, renderToStaticMarkup} from 'react-dom/server'
import {match, RoutingContext} from 'react-router'
import {render} from 'react-dom'
import Helmet from 'react-helmet'
import getRoutes from'./Routes.react'
import Root from './components/Root.react.js'
import {isClient, getPropsFromRoute} from './util'
import configureNconf from '../controllers/configureNconf'
import {main as bundleFileName} from '../public/dist/js/stats.generated.json'
const nconf = configureNconf();
import configureStore from './redux/configure-store'
import {Provider} from 'react-redux'


const store = configureStore(new Map());

function renderComponentWithRoot(Component, componentProps, initialData, url) {
  var componentHtml = renderToStaticMarkup(
    <Provider store={store}>
      <Component {...componentProps} />
    </Provider>
  );

  var head = Helmet.rewind();
  let bundleHost = undefined;
  let host = undefined;

  switch (nconf.get("NODE_ENV")) {
    case "local_production":
      bundleHost = "http://localhost:" + nconf.get("PORT") + '/js/';
      host="/";
      break;
    case "local":
      bundleHost = "http://localhost:8080/public/dist/js/";
      host="/";
      break;
    case "staging":
      bundleHost = 'http://d35c1uuh677ymk.cloudfront.net/js/';
      host = 'http://d35c1uuh677ymk.cloudfront.net/';
      break;
    case "production":
      bundleHost = 'http://static.app.kinetic.fitness/js/';
      host = 'http://static.app.kinetic.fitness/';
      break;
    default:
      throw new Error("Unknown environment: " + nconf.get("NODE_ENV") + "must be one of: 'production', 'staging', 'local");
  }

  const bundle = bundleHost + _.flatten([bundleFileName])[0];

  return '<!doctype html>\n' +
    renderToStaticMarkup(
      <Root content={componentHtml}
            head={head}
            bundle={bundle}
            host={host}
      />
    );
}


function handleRedirect(res, redirectLocation) {
  res.redirect(302, redirectLocation.pathname + redirectLocation.search);
}

function handle404(res) {
  res.status(404).send('not found');
}
function handleError(res, error) {
  res.status(500).send(error.message)
}

function handleRoute(req, res, renderProps) {
  let routeProps = null;
  /*if (renderProps) {
    routeProps = getPropsFromRoute(renderProps, ['requestState']);
  }*/

  function renderPage(response) {
    const wholeHtml = renderComponentWithRoot(RoutingContext, renderProps, response, req.originalUrl);
    res.status(200).send(wholeHtml);
  }

  if (routeProps && routeProps.requestState) {
    routeProps.requestState().then(renderPage);
  } else {
    renderPage();
  }
}

export default function serverRouter(req, res) {
  match({routes: getRoutes(), location: req.url}, (error, redirectLocation, renderProps)=>{
    if (error) {
      handleError(res, error);
    } else if (res && redirectLocation) {
      handleRedirect(res, redirectLocation)
    } else if (renderProps) {
      handleRoute(req, res, renderProps)
    } else {
      handle404(res);
    }
  })
}
