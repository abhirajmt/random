/* 
Input: Object of a GraphQL 'Widget' type 
Output: Copy of the object with 'Config' types converted into simple key value objects
Usecase: When the main app chooses not to parse GraphQL response at their end.
*/
export const ConfigTypeValueMapper = {
  TEXT: "stringValue",
  BOOL: "boolValue",
};

const isFunction = values => {
  return typeof values === "function";
};

export const isObject = obj => typeof obj === 'object' && obj !== null
;
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

const ErrorCodes = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  INPUT_ERROR: "INPUT_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  SCRIPT_ERROR: "SCRIPT_ERROR",
  RENDER_ERROR: "RENDER_ERROR",
  INVALID_CALLBACK_ERROR: "INVALID_CALLBACK_ERROR"
};

class BaseWidgetError {
  constructor(message, code, cause) {
    console.log(message, cause);
    this.code = code || ErrorCodes.UNKNOWN_ERROR;
    this.formatted = {
      type: this.name,
      code: this.code,
      stack: this.stack,
      message: this.message,
    };
  }

  printCause() {
    console.error(this.cause); // eslint-disable-line
  }

  print() {
    console.error(this.formatted); // eslint-disable-line
  }

  printTable() {
    console.table(this.formatted); // eslint-disable-line
  }
}

class ParserError extends BaseWidgetError {}


const isValidElement = (key, value, type, valueTypeMap) => {
  return (
    isString(key) &&
    isString(type) &&
    isDefined(valueTypeMap[type]) &&
    isDefined(value[valueTypeMap[type]])
  );
};

export const parseConfig = (
  config = [],
  path,
  valueTypeMap = ConfigTypeValueMapper
) => {
  if (!isObject(valueTypeMap)) {
    throw new ParserError(
      "valueTypeMap can only be an object",
      ErrorCodes.INPUT_ERROR,
      { valueTypeMap }
    );
  }

  if (!isArray(config)) {
    throw new ParserError(
      `config can only be an array for path ${path}`,
      ErrorCodes.INPUT_ERROR,
      { config }
    );
  }

  return config.reduce((parsedConfig, { key, value, type }, index) => {
    if (!isValidElement(key, value, type, valueTypeMap)) {
      throw new ParserError(
        `Invalid config element at index ${index} for config at path ${path}`,
        ErrorCodes.INPUT_ERROR,
        { config }
      );
    }
    return {
      ...parsedConfig,
      [key]: value[valueTypeMap[type]],
    };
  }, {});
};
