import {normalize, Schema, arrayOf} from 'normalizr'


const entrySchema = new Schema('entries', {
  idAttribute: 'id'
});
const workoutSchema = new Schema('workouts', {
  idAttribute: 'workout',
});
const constraintSchema = new Schema('constraints', {
  idAttribute: 'id'
});

entrySchema.define({
  subNodes: arrayOf(entrySchema),
  constraints: arrayOf(constraintSchema)
});

workoutSchema.define({
  root: entrySchema
});

const unitSchema = new Schema('units', {
  idAttribute: 'name'
});


const titleSchema = new Schema('titles', {
  idAttribute: 'title'
});
export {entrySchema as ENTRY_SCHEMA}
export {workoutSchema as WORKOUT_SCHEMA};
export {titleSchema as TITLE_SCHEMA};
export {unitSchema as UNIT_SCHEMA};


/**
 * [{
 * workout: '123',
 * root: {
 *   id: '123'
 *   title: 'Workout'
 *   subNodes: [{
 *     id: '456'
 *     title: 'Deadlift'
 *   },
 *   {
 *     id: '678'
 *     title: 'Group'
 *     subNodes: [{
 *
 *     }]
 *   }
 *   ]
 * }
 * }]
 **/