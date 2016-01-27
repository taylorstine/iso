//window.jQuery = window.$ = require('jquery/dist/jquery.min');
window.jQuery = window.$ = require('jquery/dist/jquery');
import keyMirror from 'keymirror'
import Rx from 'rx'
import {Parse} from 'parse'
import _ from 'lodash'
import {EventEmitter} from 'events'
import {isProd, isStage, getCookie, setCookie} from '../util'
import {Map, fromJS} from 'immutable'

const Environments = keyMirror({
  LOCAL: null,
  STAGE: null,
  PROD: null
});


export default function init ({dispatch}:{dispatch:Function}) {

  let fbId;
  let env = Environments.LOCAL;
  const _rollbarConfig = {
    accessToken: "a918d073191c4e729fb140ad21cb2d58",
    captureUncaught: true,
    payload: {
      environment: "local",
      client: {
        javascript: {
        }
      }
    }
  };

  if (isStage()) {
    env = Environments.STAGE
  } else if (isProd()) {
    env = Environments.PROD
  }

  switch (env) {
    case Environments.STAGE:
      Parse.initialize("aeYITlUUOCT7rOhFyjeo77IdfuLEuMWDCzageqti", "7q9P2IId2tyVhwN0ySwxsTL8ZDUiUavuBMwyi41r");
      fbId = '158793754467933';
      _rollbarConfig.payload.environment = "stage";
      _rollbarConfig.payload.client.javascript['source_map_enabled'] = true;
      _rollbarConfig.payload.client.javascript['code_version'] = "21988";
      _rollbarConfig.payload.client.javascript['guess_uncaught_frames'] = true;
      break;

    case Environments.PROD:
      Parse.initialize("uvYho1je50Tsq4K7pVRaDjftBZz84r2mW1jYwJNN", "OE9jgCifPKBZWAGCsbHSDWVMcThaanYZhgI0p1SG");
      fbId = '156606831353292';
      if (/kinetic-wap.herokuapp.com/.test(window.location.hostname)) {
        fbId = '166045670409408';
      }
      _rollbarConfig.payload.environment = "prod";
      _rollbarConfig.payload.client.javascript['source_map_enabled'] = true;
      _rollbarConfig.payload.client.javascript['code_version'] = "21988";
      _rollbarConfig.payload.client.javascript['guess_uncaught_frames'] = true;
      break;

    case Environments.LOCAL:
    default:
      //local
      Parse.initialize("D2Iro1HkbdRVR3gKV1blNF2ou9fylcLUPMLIEStX", "Cu5Zqosh8rc7MaNwwVjrpyyjO9fDxC3pXXWMRaaC");
      fbId = '166045320409443';

      window.doGremlins = function (seed) {
        gremlins.createHorde()
                .seed(seed || 1234)
                .before(()=>console.profile('gremlins'))
                .after(()=>console.profileEnd())
                .unleash();
      }
  }


  //google analytics
  //@formatter:off
  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');


  //rollbar
  !function(r){function o(e){if(t[e])return t[e].exports;var n=t[e]={exports:{},id:e,loaded:!1};return r[e].call(n.exports,n,n.exports,o),n.loaded=!0,n.exports}var t={};return o.m=r,o.c=t,o.p="",o(0)}([function(r,o,t){"use strict";var e=t(1).Rollbar,n=t(2);_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://d37gvrvc0wt4s1.cloudfront.net/js/v1.8/rollbar.min.js";var a=e.init(window,_rollbarConfig),i=n(a,_rollbarConfig);a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,i)},function(r,o){"use strict";function t(r){return function(){try{return r.apply(this,arguments)}catch(o){try{console.error("[Rollbar]: Internal error",o)}catch(t){}}}}function e(r,o,t){window._rollbarWrappedError&&(t[4]||(t[4]=window._rollbarWrappedError),t[5]||(t[5]=window._rollbarWrappedError._rollbarContext),window._rollbarWrappedError=null),r.uncaughtError.apply(r,t),o&&o.apply(window,t)}function n(r){var o=function(){var o=Array.prototype.slice.call(arguments,0);e(r,r._rollbarOldOnError,o)};return o.belongsToShim=!0,o}function a(r){this.shimId=++s,this.notifier=null,this.parentShim=r,this._rollbarOldOnError=null}function i(r){var o=a;return t(function(){if(this.notifier)return this.notifier[r].apply(this.notifier,arguments);var t=this,e="scope"===r;e&&(t=new o(this));var n=Array.prototype.slice.call(arguments,0),a={shim:t,method:r,args:n,ts:new Date};return window._rollbarShimQueue.push(a),e?t:void 0})}function l(r,o){if(o.hasOwnProperty&&o.hasOwnProperty("addEventListener")){var t=o.addEventListener;o.addEventListener=function(o,e,n){t.call(this,o,r.wrap(e),n)};var e=o.removeEventListener;o.removeEventListener=function(r,o,t){e.call(this,r,o&&o._wrapped?o._wrapped:o,t)}}}var s=0;a.init=function(r,o){var e=o.globalAlias||"Rollbar";if("object"==typeof r[e])return r[e];r._rollbarShimQueue=[],r._rollbarWrappedError=null,o=o||{};var i=new a;return t(function(){if(i.configure(o),o.captureUncaught){i._rollbarOldOnError=r.onerror,r.onerror=n(i);var t,a,s="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(t=0;t<s.length;++t)a=s[t],r[a]&&r[a].prototype&&l(i,r[a].prototype)}return r[e]=i,i})()},a.prototype.loadFull=function(r,o,e,n,a){var i=function(){var o;if(void 0===r._rollbarPayloadQueue){var t,e,n,i;for(o=new Error("rollbar.js did not load");t=r._rollbarShimQueue.shift();)for(n=t.args,i=0;i<n.length;++i)if(e=n[i],"function"==typeof e){e(o);break}}"function"==typeof a&&a(o)},l=!1,s=o.createElement("script"),u=o.getElementsByTagName("script")[0],p=u.parentNode;s.crossOrigin="",s.src=n.rollbarJsUrl,s.async=!e,s.onload=s.onreadystatechange=t(function(){if(!(l||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){s.onload=s.onreadystatechange=null;try{p.removeChild(s)}catch(r){}l=!0,i()}}),p.insertBefore(s,u)},a.prototype.wrap=function(r,o){try{var t;if(t="function"==typeof o?o:function(){return o||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped){r._wrapped=function(){try{return r.apply(this,arguments)}catch(o){throw o._rollbarContext=t()||{},o._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=o,o}},r._wrapped._isWrap=!0;for(var e in r)r.hasOwnProperty(e)&&(r._wrapped[e]=r[e])}return r._wrapped}catch(n){return r}};for(var u="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError".split(","),p=0;p<u.length;++p)a.prototype[u[p]]=i(u[p]);r.exports={Rollbar:a,_rollbarWindowOnError:e}},function(r,o){"use strict";r.exports=function(r,o){return function(t){if(!t&&!window._rollbarInitialized){var e=window.RollbarNotifier,n=o||{},a=n.globalAlias||"Rollbar",i=window.Rollbar.init(n,r);i._processShimQueue(window._rollbarShimQueue||[]),window[a]=i,window._rollbarInitialized=!0,e.processPayloads()}}}}]);
  //@formatter:on

/*
  ga('create', 'UA-63845129-4', 'auto');
  ga('send', 'pageview');*/

  Rollbar.configure({
    checkIgnore: (isUncaught, args, payload)=> {
      return payload.data.environment === 'local';
    }
  });


  window.logger = (function (oldConsole) {
    return {
      log: function (msg) {
        oldConsole.log(msg)
      },
      info: function (msg) {
        oldConsole.info(msg)
      },
      warn: function (msg) {
        oldConsole.warn(msg);
        ga('send', 'exception', {
          'exDescription': 'Warning: ' + msg,
          'exFatal': false
        });
      },
      error: function (msg) {
        oldConsole.error(msg);
        ga('send', 'exception', {
          'exDescription': msg + '',
          'exFatal': true
        })
      }
    }
  })(window.console);

  const BACK_EVENT = "APP_BACK";
  const backEmitter = new EventEmitter();
  Rx.Observable.fromEvent(backEmitter, BACK_EVENT)
    .throttle(500)
    .subscribe(()=> {
      $(window).trigger("app-back")
    });
  window.appBack = ()=>backEmitter.emit(BACK_EVENT);

  let pageY = 0;
  let pullCandidate = false;

  document.querySelector('body').addEventListener('touchmove', function (e) {
    $('paper-ripple[animating]').each(function () {
      this.ripples.forEach(ripple=>this.removeRipple(ripple))
    })
  });

  $(()=> {
    /**Only attach these listeners if the javascript interface we injected from our app is available**/
    if (typeof KineticApp !== 'undefined') {
      document.querySelector('body').addEventListener('touchstart', function (e) {
        pullCandidate = true;
        pageY = e.touches[0].pageY;
        _.each(e.path, node=> {
          if (0 < node.scrollTop) {
            pullCandidate = false;
            return false;
          }
        });
      });

      document.querySelector('body').addEventListener('touchmove', function (e) {
        if (!pullCandidate || e.defaultPrevented) {
          return;
        }
        let dy = pageY - e.touches[0].pageY;
        if (dy < 0) {
          e.target.fire && e.target.fire('up');
          $(window).trigger('pullstart');
          //noinspection JSUnresolvedVariable
          KineticApp.allowPull();
        } else {
          pullCandidate = false;
        }
      });
    }

    const preventScrollListener = (e)=>{
      e.stopImmediatePropagation();
      e.preventDefault();
      e.stopPropagation();
    };
    window.iosStartScroll = function() {
      document.querySelector('body').removeEventListener('touchmove', preventScrollListener, true);
    };
    window.iosStopScroll= function() {
      document.querySelector('body').addEventListener('touchmove', preventScrollListener, true);
    };

    window.iosFacebookLogin = function () {
      $(()=> {
        $('#facebookLoginButton').click()
      })
    }
  });

  window.tests = {};

  /**Safari private browsing throws an error if local or session storage api is used.  Shim the storage if such an exception is thrown**/
  function shimStorage(storageKey) {
    window[storageKey].setItem = (key, value)=>{
      window[storageKey].setData(window[storageKey].getData().set(key, value + ''));
    };
    window[storageKey].getItem = (key)=>window[storageKey].getData().get(key);
    window[storageKey].clear = ()=>{
      window[storageKey].setData(window[storageKey].getData().clear())
    };
    window[storageKey].key = (idx)=>window[storageKey].getData().keySeq().get(idx)
    window[storageKey].removeItem = (key)=>{
      window[storageKey].setData(window[storageKey].getData().delete(key));
    };
    window[storageKey].__proto__.getData = ()=> {
      const cookieString = getCookie(storageKey);
      let js = {};
      try {
        js = JSON.parse(cookieString)
      } catch(e) {
        console.warn('shim storage cookie parse failed');
      }
      return fromJS(js || {});
    };
    window[storageKey].__proto__.setData = (newData)=> {
      setCookie(storageKey, JSON.stringify(newData), 365);
    };
  }
  try {
    window.localStorage.setItem('test', true)
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      shimStorage('localStorage');
      shimStorage('sessionStorage');
    }
  }

  window.close = function() {}
}

