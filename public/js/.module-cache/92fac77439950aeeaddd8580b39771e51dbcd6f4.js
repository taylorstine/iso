var React = require('react');

//var WorkoutLog = require('./components/WorkoutLog.react');

/*
var EntryField = React.createClass({
  render: function() {
    return (
      <div>HI</div>
    )
  }
});

var WorkoutCanvas = React.createClass({
  render: function() {
    return(
      <div className="workout-canvas">
      </div>
    )
  }
})
*/

var WorkoutLog = React.createClass({displayName: "WorkoutLog",
  render: function() {
    return (
      React.createElement("div", {className: "workoutLog"}, 
        "Hello world"
      )
    )
  }
})




React.render(
  React.createElement(WorkoutLog, null),
  document.getElementById('kineticApp')
);