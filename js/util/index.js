import $ from 'jquery'
import _ from 'lodash'
import {Parse} from 'parse'
import {LAYOUTS, groupColorList, colorList} from '../constants'
import moment from 'moment'
import {List} from 'immutable'


export function getPropsFromRoute ({ routes }, componentProps) {
  let props = {};
  const lastRoute = routes[routes.length - 1];

  routes.reduceRight((prevRoute, currRoute) => {

    var component = currRoute.component;
    if ('function' === typeof currRoute.component) {
      component = currRoute.component();
    }

    componentProps.forEach(componentProp => {
      if (!props[componentProp] && component[componentProp]) {
        props[componentProp] = currRoute.component[componentProp];
      }
    });

  }, lastRoute);

  return props;
}

export const isClient = ('undefined' !== typeof document);


export function isOutsideBounds ({bounds: bounds = {
  top: top,
  left: left,
  width: width,
  height: height
}, point: point = {x: x, y: y}}) {
  const bottom = bounds.top + bounds.height;
  const right = bounds.left + bounds.width;
  if (bounds.top > point.y || bottom < point.y) {
    return true;
  }
  if (bounds.left > point.x || right < point.x) {
    return true;
  }
  return false;
}

export function getBounds (el) {
  let $el = $(el);
  return {
    top: $el.offset().top,
    left: $el.offset().left,
    width: $el.width(),
    height: $el.height()
  }
}

export const PARENT_SAVE_CHUNK_SIZE = 5;

export function chunkOperation (entryIdsParentIdMapping, getter, entryAction) {
  /**Loop through the entrys that were added to a sub entry, using the key as the parent id**/
  return _.filter(_.map(entryIdsParentIdMapping, (entryIds, parentId)=> {
    let parent = getter(parentId);
    if (!parent) {
      return null
    }
    /**Chunk the entry ids.  If there is a large quantity this will increse efficiency**/
    let chunkedEntryIds = _.chunk(entryIds, PARENT_SAVE_CHUNK_SIZE);
    let saveParentPromise = Parse.Promise.as();
    _.each(chunkedEntryIds, entryIdsChunk=> {
      saveParentPromise = saveParentPromise.then(savedParent=> {
        parent = savedParent || parent;
        /**Get each entry from the id**/
        let entries = _.map(entryIdsChunk, id=>getter(id));
        /**Perform each action on the entry/parent**/
        _.each(entries, entry=>entryAction(entry, parent));
        /**Save the parent**/
        return parent.save();
      })
    })
    return saveParentPromise;
  }))

}


export function getWindowLayout () {
  if (typeof window === 'undefined') {
    return LAYOUTS.MEDIUM;
  }

  var width = $(window).width();

  if (width <= 768) {
    return LAYOUTS.XSMALL
  }
  if (width <= 992) {
    return LAYOUTS.SMALL
  }
  if (width <= 1200) {
    return LAYOUTS.MEDIUM
  }
  if (width <= 1500) {
    return LAYOUTS.LARGE
  } else {
    return LAYOUTS.XLARGE;
  }

}


export function entryGroupColor (level:number) {
  let idx = Math.min(groupColorList.length - 1, level);
  return groupColorList[idx];
}


export function getTimeStringComponents (rawSeconds:number) {
  var time = getTimeComponents(rawSeconds);
  return {
    seconds: padTwo(time.seconds),
    minutes: padTwo(time.minutes)
  }
}

export function removeDigits (text) {
  return text && text.replace(/[0-9]/g, '');
}

export function makeId () {
  return ("000000" + (Math.random() * Math.pow(36, 6) << 0).toString(36)).slice(-6)
}

export function getTimeComponents (rawSeconds:number) {
  return {
    seconds: rawSeconds % 60,
    minutes: Math.min(Math.floor(rawSeconds / 60), 59)
  }
}

export function charOnly (input) {
  return input && input.replace(/(\d|[^\w\s])/g, '');
}

export function getErrorCode (error:{code:number}|Array) {
  let code = error.code;
  if (_.isArray(error)) {
    _(error).filter().forEach(val=> {
      if (val.code) {
        code = val.code;
        return false;
      }
    })
  }
  return code;
}

function padTwo (num) {
  if (num < 99) {
    num = ('0' + num).slice(-2);
  }
  return num;
}

const divisor = Math.ceil(Math.max(26 / colorList.length, 1));
export function getWorkoutColor (letter) {
  let firstChar = letter.charAt(0);
  if (firstChar.toLowerCase() == 'w') {
    return 'grey';
  }
  var idx = firstChar.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
  return colorList[Math.floor(idx / divisor)]
}

export function readableDate (date) {
  return moment(date).format('MMM D');
}

export function toArray (obj) {
  return _.flatten([obj]);
}

export function onWebComponentsReady(fnc:()=>any) {
  if (isWebComponentsReady()) {
    fnc();
  } else {
    window.addEventListener('WebComponentsReady', fnc);
  }
}

export function isWebComponentsReady() {
  return (window.CustomElements && window.CustomElements.ready) || window.CustomElements.useNative;
}

export const stageRegex = [/-dev/, /localhost-dev/];
export const prodRegex = [/kineticapp\.io/, /kinetic-wap\.herokuapp\.com/, /app\.kinetic\.fitness/, /localhost-prod/];

export function isProd() {
  return _.any(prodRegex, reg=>reg.test(window.location.hostname));
}

export function isStage() {
  return _.any(stageRegex, reg=>reg.test(window.location.hostname))
}
export function isLocal() {
  return !isStage() && !isProd();
}

export function setCookie(name:string, value:string, days:number) {
  if (!isClient) throw new Error('attempted to set cookie in server environment: ' + name);

  let expires = '';
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  }
  document.cookie = name+ '=' + value + expires + '; path=/';
}


export function getCookie(name:string) {
  if (!isClient) throw new Error('attempted to read cookie in server environment: ' + name);
  const nameEq = name + '=';
  const cookies = new List(document.cookie.split(';'));
  const cookieString = cookies.map(cookie=>_.trim(cookie)).find(cookie=>cookie.indexOf(nameEq) === 0);
  if (cookieString) {
    return cookieString.substring(nameEq.length, cookieString.length);
  }
  return null;
}