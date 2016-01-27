import React from 'react';

const Root = ({head, content, bundle, host})=>(
  <html>
    <head>
      {head.title.toComponent()}
      {head.meta.toComponent()}
      {head.link.toComponent()}
      <link rel='stylesheet' href={host +'css/main.css'} type="text/css"/>
      <link rel="shortcut icon" href="/favicon.ico?v=1" />
      <link rel="import" href={host + "html/components.html"} async/>
    </head>
    <body>
      <div className="cover-absolute white layout horizontal center center-justified">
        <Loader/>
      </div>
      <div id="root"
           className="fill"
           dangerouslySetInnerHTML={{__html: content}}>
      </div>


      {head.script.toComponent()}
      {/**If a CORS error occurs here, add a crossOrigin attribute to the script tag.  This guarentees the content will be loaded asynchronously*/}
      <script
        dangerouslySetInnerHTML={{__html:"document.addEventListener('DOMContentLoaded', function() {setTimeout(function() {['" + bundle + "'].forEach(function(src) {var script = document.createElement('script');script.src = src; document.body.appendChild(script);})}, 18);})"}}></script>
    </body>
  </html>
);


Root.defaultProps = {
  host: '/'
};
Root.propTypes = {
  host: React.PropTypes.string
};
Root.displayName = "Root";

export default Root
