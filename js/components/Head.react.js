import React from 'react'
import Helmet from 'react-helmet'

const Head = (props) =>(
  <Helmet
    title="Kinetic App"
    titleTemplate="%s | Kinetic App"
    meta={[
      {'charset': 'utf-8'},
      {'http-equiv': 'X-UA-Compatible', 'content': 'IE=edge,chrome=1'},
      {'name': 'viewport', 'content': 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'},
      {'name': 'description', 'content': 'Kinetic WAP'},
    ]}
  />
);

Head.displayName = "Head";

export default Head;

