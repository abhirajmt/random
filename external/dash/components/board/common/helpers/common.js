import isPlainObject from "is-plain-object";

const isFunction = values => {
  return typeof values === "function";
};

const isObject = value => {
  return isPlainObject(value);
};
const isArray = value => {
  return Array.isArray(value);
};

const keys = value => {
  if (!isObject(value)) return [];
  return Object.keys(value);
};

const values = value => {
  if (!isObject(value)) return [];
  return Object.values(value);
};

const isString = value => {
  return typeof value === "string";
};
const isNumber = value => {
  return Number.isNumber(value);
};

const isNull = value => {
  return value === null;
};

const isUndefined = value => {
  return value === undefined;
};

const isDefined = value => {
  return !isNull(value) && !isUndefined(value);
};

const isEmpty = value => {
  if (isArray(value) || isString(value)) return !value.length;
  if (isObject(value)) return !keys(value).length;
  return !isDefined(value);
};

const clone = (objectToClone = {}) => {
  return JSON.parse(JSON.stringify(objectToClone));
};

/* eslint-disable no-param-reassign */
const flattenUptoDepth = (arr, depth) =>
  arr.reduce((flat, toFlatten) => {
    if (depth > 1 && isArray(toFlatten)) {
      flat = flat.concat(flattenUptoDepth(toFlatten, depth - 1));
    } else {
      flat.push(toFlatten);
    }
    return flat;
  }, []);
/* eslint-enable no-param-reassign */

const customStringify = a => {
  try {
    return JSON.stringify(a);
  } catch (error) {
    return false;
  }
};

const deepEqual = (a, b) => {
  if (isObject(a) && isObject(b)) {
    return Object.is(customStringify(a), customStringify(b));
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const am = a.map(v => customStringify(v)).join(",");
    const bm = b.map(v => customStringify(v)).join(",");
    return am === bm;
  }
  return a === b;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const splitByExistingKeys = (arr, obj) => {
  const included = {};
  const excluded = {};
  Object.keys(obj).forEach(prop => {
    if (arr.includes(prop)) {
      included[prop] = obj[prop];
    } else {
      excluded[prop] = obj[prop];
    }
  });
  return {
    included,
    excluded,
  };
};

const pickObject = (obj, objKeys) => {
  return splitByExistingKeys(objKeys, obj).included;
};

export {
  clone,
  sleep,
  deepEqual,
  flattenUptoDepth,
  isArray,
  isDefined,
  isEmpty,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
  keys,
  values,
  splitByExistingKeys,
  pickObject,
  isFunction,
};
