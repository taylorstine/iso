import {Parse} from 'parse'
import {Map} from 'immutable'
export default function networkMiddleware({dispatch, getState}) {
  return next=> action=> {
    const {shouldLoad=()=>true, failPayload=error=>({error}), shouldTryAgain=()=>true} = action;
    const sequence:?Array<string> = action.sequence;

    if (!sequence) {return next(action);}
    if (sequence.length !== 3) {throw new Error("Sequence must be an array of length 3");}
    if (!shouldLoad(getState())) {return Parse.Promise.as();}
    const [requestType, successType, failureType] = sequence;
    const requestPayload:(state?:Map)=>Object = action.requestPayload || (()=>{});
    dispatch({
      type: requestType,
      ...requestPayload(getState())
    });

    const load:(dispatch?:Function, state?:Map)=>Promise = action.load;
    const successPayload:(response?:any, state?:Map)=>Object = action.successPayload || (()=>{});

    return networkCall();

    function networkCall(attempts = 0) {
      return load(dispatch, getState())
        .then(response=>dispatch({
          type: successType,
          ...successPayload(response, getState())
        }))
        .fail(e=> {
          console.log('failure');
          if (attempts < 3 && shouldTryAgain(e)) {
            return setTimeout(()=>networkCall(attempts + 1), 1500);
          }
          dispatch({
            type: failureType,
            ...failPayload(e)
          })
        })
    }
  }
}