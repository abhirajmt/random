import { AL_FEATURE_COOKIE } from '../config/constants';

export const isAdminSite = (host = '') => {
  const regex = /^(admin|dashboard)\.[0-9a-z].*/gm;
  return regex.exec(host);
};

export const setALFeatureFlag = config => {
  const { alFeature } = config;
  if (alFeature && alFeature.length) {
    setCookie(AL_FEATURE_COOKIE, alFeature, 1);
  } else {
    eraseCookie(AL_FEATURE_COOKIE);
  }
};

export const setCookie = (name, value, days) => {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  // document.cookie = name + '=' + (value || '') + expires + '; path=/; domain=.mindtickle.com;';
};

export const eraseCookie = name => {
  // document.cookie =
  //   name + '=; path=/; domain=.mindtickle.com; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
