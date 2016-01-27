import _ from 'lodash'
export default function conditionalMiddleware ({dispatch, getState}) {
  return next=> action=> {
    const {conditional, requestPayload=()=>({}), positivePayload=()=>({}), negativePayload=()=>({}), invalidPayload=()=>({}), invalid=()=>false} = action;
    if (!conditional) {return next(action);}

    const conditionalSequence:Array<string> = action.conditionalSequence;
    if (!_(conditionalSequence.length).inRange(3, 5)) throw new Error('Conditional sequence must be an array of length 3 or 4');
    const [requestType, positiveType, negativeType] = conditionalSequence;

    dispatch({
      type: requestType,
      ...requestPayload()
    });

    process.nextTick(()=>{
      const invalidType = invalid(getState());
      if (invalidType) {
        dispatch({
          type: invalidType,
          ...invalidPayload()
        })
      } else if (conditional(getState())) {
        dispatch({
          type: positiveType,
          ...positivePayload()
        })
      } else {
        dispatch({
          type: negativeType,
          ...negativePayload()
        })
      }
    });


  }
}