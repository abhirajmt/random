import { isDefined, isObject, isString, isUndefined } from "./common";

// Variable Parsing - copied from widget-engine
export const makeVariable = value => {
  return `{{${value}}}`;
};
export const postmanVar = /{{([^}]*)}}/;
export const postmanVarGlobal = new RegExp(postmanVar, "g");

export const extractVariables = value => {
  if (!isString(value)) return [];
  const matches = {};
  let m;
  do {
    m = postmanVarGlobal.exec(value);
    if (m) {
      matches[m[1]] = true;
    }
  } while (m);
  return Object.keys(matches);
};

const replaceExtractedVariable = (
  subjectString,
  variable,
  value,
  { skipUndefined }
) => {
  if (
    !isDefined(value) &&
    skipUndefined
  ) {
    return subjectString;
  }
  const varString = makeVariable(variable);
  if (subjectString === varString) {
    // if whole string is a variable, don't use string concatenation. This preserves types
    return value;
  }
  // Note: multi-var replacement will typecast the value to string
  const replaceString = `${value}`;
  return subjectString.split(varString).join(replaceString);
};

export const replaceVariablesInString = (
  subjectString,
  environment,
  { skipUndefined = false, _visitedColorMap = {}, _resolvedValueMap = {} } = {}
) => {
  if (!isString(subjectString)) return subjectString;
  let replacedValue = subjectString;
  const neighbors = extractVariables(subjectString);
  neighbors.forEach(variable => {
    if (isUndefined(_visitedColorMap[variable])) {
      // apply replacement on fresh variable
      _visitedColorMap[variable] = "GRAY"; // forward path
      _resolvedValueMap[variable] = replaceVariablesInString(
        environment[variable],
        environment,
        { skipUndefined, _visitedColorMap, _resolvedValueMap }
      );
      _visitedColorMap[variable] = "BLACK"; // backward path

      replacedValue = replaceExtractedVariable(
        replacedValue,
        variable,
        _resolvedValueMap[variable],
        { skipUndefined }
      );
    } else if (_visitedColorMap[variable] === "BLACK") {
      // no further cycles
      replacedValue = replaceExtractedVariable(
        replacedValue,
        variable,
        _resolvedValueMap[variable],
        { skipUndefined }
      );
    }
  });

  return replacedValue;
};

export const replaceVariablesOnSubject = (
  subject = {},
  environment,
  options
) => {
  if (isObject(subject)) {
    const replacedObject = {};
    Object.keys(subject).forEach(key => {
      replacedObject[key] = replaceVariablesInString(
        subject[key],
        environment,
        options
      );
    });
    return replacedObject;
  }
  if (isString(subject)) {
    return replaceVariablesInString(subject, environment, options);
  }
};

export const replaceVariablesAtKeys = (
  subject = {},
  environment,
  replacementKeys = [],
  options
) => {
  /* eslint-disable no-param-reassign */
  const replacedSubject = Object.keys(subject).reduce((obj, key) => {
    obj[key] = replacementKeys.includes(key)
      ? replaceVariablesOnSubject(subject[key], environment, options)
      : subject[key];
    return obj;
  }, {});
  /* eslint-enable no-param-reassign */

  return replacedSubject;
};
