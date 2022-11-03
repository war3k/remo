import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'es6-symbol/implement';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import * as axios from 'axios';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

let version;
const printVersionInfo = async () => {
  const styles = 'background: #E53934; color: #fff; padding: 5px 10px; ';
  const request = {
    url: './version.json',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  version = await axios(request);
  console.log(`%c${version.data.name}`, `${styles} font-size: 18px`);
  console.log(`%cVersion: ${version.data.version}`, styles);
  console.log(`%cCommit hash: ${version.data.commitHash}`, styles);
  console.log(`%cBuild date: ${version.data.buildDate}`, styles);
  console.log(`%cPowered by Maio Software House`, styles);
  console.log(`%cmaiosoftwarehouse.com`, styles);
  if (
    process.env.REACT_APP_ENV === 'prod' ||
    process.env.REACT_APP_ENV === 'stage'
  ) {
    Sentry.init({
      dsn: 'https://71b130cf92a6485c814eefb1d8fa98b5@sentry.io/1434677'
    });

    Sentry.configureScope(scope => {
      scope.setTag('environment', process.env.REACT_APP_ENV);
      scope.setTag('version TAG', version.data.version);
      scope.setTag('commit', version.data.commitHash);
      scope.setTag('buildDate', version.data.buildDate);
    });
  }
};
printVersionInfo();

/*eslint-disable */
// quick fix for Chrome 80 bug with Array.reduce
(function() {
  function getChromeVersion() {
    const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

    return raw ? parseInt(raw[2], 10) : false;
  }

  const chromeVersion = getChromeVersion();
  if (chromeVersion && chromeVersion >= 80) {
    Array.prototype.reduce = function(callback /* , initialValue */) {
      if (this == null) {
        throw new TypeError(
          'Array.prototype.reduce called on null or undefined'
        );
      }
      if (typeof callback !== 'function') {
        throw new TypeError(`${callback} is not a function`);
      }
      const t = Object(this);
      const len = t.length >>> 0;
      let k = 0;
      let value;
      if (arguments.length === 2) {
        value = arguments[1];
      } else {
        while (k < len && !(k in t)) {
          k++;
        }
        if (k >= len) {
          throw new TypeError('Reduce of empty array with no initial value');
        }
        value = t[k++];
      }
      for (; k < len; k++) {
        if (k in t) {
          value = callback(value, t[k], k, t);
        }
      }
      return value;
    };
  }
})();
/* eslint-enable */

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
