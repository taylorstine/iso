import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {isLocal, isClient} from '../util'
import createLogger from 'redux-logger'
import promiseMiddleware from 'redux-promise'
import networkMiddleware from './middleware/network-middleware'
import conditionalMiddleware from './middleware/conditional-middleware'
import rootReducer from './reducers'
import _ from 'lodash'

const loggerMiddleware = createLogger({
  stateTransformer: state=>{
    return state.toJS()
  },
  actionTransformer: action=>{
    return _.filter({
      ...action,
      data: action && action.data && action.data.toJS()
    })
  },
  predicate: ()=>isClient && isLocal()
});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  promiseMiddleware,
  networkMiddleware,
  conditionalMiddleware,
  loggerMiddleware
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}