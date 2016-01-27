import React from 'react'
import Head from './Head.react.js'
import {connect} from 'react-redux'

const App = React.createClass({
  render: function () {
    const {children} = this.props;
    const child = React.Children.only(children);
    return (
      <div>
        Hello world!
        <Head/>
        {child}
      </div>)
  },
});

App.displayName = "App";

App.childContextTypes = {
  layout: React.PropTypes.number
};

App.propTypes = {
  error: React.PropTypes.instanceOf(Map)
};


/**Map the state to props, since the state is an immutable object**/
export default connect(state=>state.toObject())(App)