// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import parseUri from './lib/parseUri';
import { createPhone } from './modules/Phone';
import App from './containers/App';
import brandConfig from './config/brand';
import prefix from './config/prefix';

const defaultApiConfig = process.env.API_CONFIG;
const appVersion = process.env.APP_VERSION;
const hostingUrl = process.env.HOSTING_URL;

const currentUri = window.location.href;
const pathParams = parseUri(currentUri);
const apiConfig = {
  appKey: pathParams.appKey || defaultApiConfig.appKey,
  appSecret: (pathParams.appKey ? pathParams.appSecret : defaultApiConfig.appSecret),
  server: pathParams.appServer || defaultApiConfig.server,
};

const redirectUri = defaultApiConfig.redirectUri || pathParams.redirectUri;
const stylesUri = pathParams.stylesUri;
let mobile;
if (typeof pathParams.mobile === 'undefined') {
  mobile = !window.matchMedia('(min-width: 650px)').matches;
} else {
  mobile = !!pathParams.mobile;
}
const preloadPosts = pathParams.preloadPosts === 'false' ? false : pathParams.preloadPosts;

const phone = createPhone({
  apiConfig,
  brandConfig,
  prefix,
  appVersion,
  redirectUri,
  stylesUri,
  mobile,
  preloadPosts,
});

const store = createStore(phone.reducer);

phone.setStore(store);

window.phone = phone;

ReactDOM.render(
  <App
    phone={phone}
    hostingUrl={hostingUrl}
    mobile={mobile}
  />,
  document.querySelector('div#viewport'),
);

