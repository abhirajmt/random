import deepmerge from "deepmerge";
import { isDefined, isUndefined, isArray, isObject } from "./common";

/* 
Inputs:
  ref: An object ref
  path: A dot notation path e.g.: key1.key2.key3 (no array notation)
  value: The value to assign at path
  createPath: Whether to create the path or skip if it doesn't exist

Output: A boolean whether value was set or not
  
Note: This is an impure function - to be used only on a newly created object
*/
const setValueAtPath = (
  ref,
  path,
  value,
  createPath = true,
  mergeArrIndexWise = false
) => {
  if (!isDefined(ref) || path === "") return false;

  const keys = path.split(".");
  const last = keys.pop();
  let pointer = ref;
  // traverse the path until we get undefined (null allowed)
  const pathDefined = keys.every(key => {
    if (!isDefined(pointer[key]) && createPath) {
      pointer[key] = {};
    }
    pointer = pointer[key];
    return isDefined(pointer);
  });
  // update config at the path if it exists
  if (pathDefined) {
    if (isArray(pointer[last]) && isArray(value)) {
      if (mergeArrIndexWise) {
        const targetArray = pointer[last];
        pointer[last] = targetArray.map((target, index) => {
          const source = value[index];
          if (isArray(target)) {
            return [...target, ...source];
          }
          if (isObject(target)) {
            return { ...target, ...source };
          }
          return source;
        });
      } else {
        pointer[last] = [...pointer[last], ...value];
      }
    } else pointer[last] = value;
  }
  return pathDefined;
};

// Note: path = "" shall return input as is.
const findValueAtPath = (data, path) => {
  if (!isDefined(path) || path === "" || !isDefined(data))
    return [data, path, false];

  // split the dot notation to get keys
  const keys = path.split(".");
  let pathExists = true;
  let lastKey;
  let pointer = data;
  // traverse the path until the path exists
  keys.every(key => {
    lastKey = key;

    // isUndefined is used here to allow pathExists to be true for a null value at end of path.
    if (!isDefined(pointer) || isUndefined(pointer[key])) {
      pathExists = false;
    }
    if (pointer !== null) pointer = pointer[key];
    return pathExists;
  });
  // Note: pathExists will be true even if pointer is undefined.
  // But pointer will be undefined if pathExists is false.
  return [pointer, lastKey, pathExists];
};

/* 
Inputs:
  data: Any object
  paths: A list of dot notation paths e.g.:[key1.key2, key3] (no array notation)
  applyFunc: A function to take value at the path and returns a value to replace it with.
  createPaths: Whether to create the path or skip if it doesn't exist
  Note: applyFunc needs to handle an undefined value as input

Output: Returns a merged object with applied values at paths
*/
const applyAtPaths = (data, paths, applyFunc, createPaths = false) => {
  // create a new object containing only the given paths
  const sparseObject = paths.reduce((reducedObject, path) => {
    const [value, lastKey, pathExists] = findValueAtPath(data, path); // eslint-disable-line
    if (!pathExists && !createPaths) return reducedObject;
    setValueAtPath(reducedObject, path, applyFunc(value, path), true);
    return reducedObject;
  }, {});

  // merge it into original object
  return deepmerge(data, sparseObject);
};

const createFullEnvironment = (data, envStack) => {
  let mergedValue = {};
  envStack.forEach(path => {
    const [value] = findValueAtPath(data, path);
    if (value) mergedValue = deepmerge(mergedValue, value);
  });
  return mergedValue;
};

export { findValueAtPath, setValueAtPath, applyAtPaths, createFullEnvironment };
