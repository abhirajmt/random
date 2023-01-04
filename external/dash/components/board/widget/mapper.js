import {
  setValueAtPath,
  findValueAtPath,
  flattenUptoDepth,
  isArray,
  isDefined,
  isEmpty,
  isUndefined,
  validate,
} from "../common/helpers";

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



// Note: updating collectValues shall result in updating dryCollectValues as well
const collectValues = (ref, pathInfos) => {
  const [pathInfo, ...rest] = pathInfos;
  const [path, shouldBeArray] = pathInfo;
  const [pathVal, , pathExists] = findValueAtPath(ref, path);

  if (!pathExists) {
    return shouldBeArray ? [] : pathVal;
  }
  // Check end of path.
  if (isEmpty(rest)) {
    // Note: pathVal may be undefined, which is handled in setValue.
    return pathVal;
  }

  // Note: array is expected here
  return pathVal.map(val => collectValues(val, rest));
};

const setValues = (ref, paths, values, depthToFlatten) => {
  if (isUndefined(values)) return;
  // Note: path will always be a non-empty string
  const [path, ...rest] = paths;
  // End of path, unpack the array
  if (isEmpty(rest)) {
    setValueAtPath(
      ref,
      path,
      isArray(values) ? flattenUptoDepth(values, depthToFlatten) : values,
      true,
      false
    );
    return;
  }
  let [arrayRef] = findValueAtPath(ref, path);
  // create an array for the first time
  if (!isDefined(arrayRef)) {
    arrayRef = [...new Array(values.length)].map(() => ({}));
  }
  values.forEach((val, i) =>
    setValues(arrayRef[i], rest, val, depthToFlatten - 1)
  );
  setValueAtPath(ref, path, arrayRef, true, true);
};

const getArrayPaths = paths => {
  const arrPaths = paths.split("[]").reduce((arr, p, ind, ref) => {
    const path = p[0] === "." ? p.slice(1) : p;
    if (path !== "") {
      const shouldBeArray = ind !== ref.length - 1;
      arr.push([path, shouldBeArray]);
    }
    return arr;
  }, []);
  return arrPaths;
};

/*
This is a dry-run version of runMapper.
This only validates whether the data item can be mapped correctly or not.
*/

// Note: this code should correlate with "collectValues" function
const dryCollectValues = (ref, paths, { mapPath, isOptional, errorUtil }) => {
  const [pathInfo, ...rest] = paths;
  const [path, shouldBeArray] = pathInfo;
  const [pathVal, lastKey, pathExists] = findValueAtPath(ref, path);

  if (!pathExists) {
    if (!isOptional)
      errorUtil(
        `Field '${lastKey}' missing in path: ${mapPath} which is not Optional`
      );
    return shouldBeArray ? [] : pathVal;
  }

  // Note: isOptional check is not required here.
  if (shouldBeArray && !isArray(pathVal)) {
    // Note: pathExists = true & pathVal = null for array is also captured here
    errorUtil(
      `An array type is required for subpath '${path}' in path: '${mapPath}'`
    );
  }

  // Check if it's the end of path.
  if (isEmpty(rest)) {
    // Note: pathVal may be undefined, which is handled in setValue.
    return pathVal;
  }

  // Note: array is expected here
  return pathVal.map(val =>
    dryCollectValues(val, rest, { mapPath, isOptional, errorUtil })
  );
};

const dryRunMapper = (mapper, data, dataIndex) => {
  const errorUtil = message => {
    throw new ParserError(
      `dataMapper: for root[${dataIndex}]: ${message}`,
      ErrorCodes.INPUT_ERROR,
      { mapper, data, dataIndex }
    );
  };
  mapper.forEach(({ mapPath, isOptional }) => {
    const mapPathListInfo = getArrayPaths(mapPath);
    dryCollectValues(data, mapPathListInfo, {
      mapPath,
      isOptional,
      errorUtil,
    });
  });
};
/* 
  Input:
    mapper: has the format [{mapPath, mapTo, isOptional}]
            Each mapPath-mapTo pair can have any level of array nesting, with possibly uneven nesting between mappings
            e.g. path1[].path2[].path3 : path4[].path5
    data: An object e.g. a module from a module list fetched from an api request.
    dataIndex: index of the object from the list fetched(0 in case of singular object)    
  Output: Returns an object with values from 'mapPath' paths of data object, stored into its 'mapTo' paths, 
  
  Note: Original references are copied into the mappedData object as it is expected to be read-only.
*/
const runMapper = (mapper, data) => {
  return mapper.reduce((mappedData, { mapPath, mapTo }) => {
    const mapPathListInfo = getArrayPaths(mapPath);
    const mapToList = getArrayPaths(mapTo).map(path => path[0]);
    const fromValues = collectValues(data, mapPathListInfo);
    setValues(
      mappedData,
      mapToList,
      fromValues,
      mapPathListInfo.filter(_ => _[1]).length
    );
    return mappedData;
  }, {});
};

const getMapperParser = mapper => (data, dataIndex) => {
  dryRunMapper(mapper, data, dataIndex);
  return runMapper(mapper, data);
};

const getDataMapper = (mapper) => {
  // special values in gql
  if (mapper === null || isArray(mapper) && mapper.length === 0) return fetchedData => fetchedData;
  validate.mapperOnly(mapper);
  const parser = getMapperParser(mapper);

  return fetchedData => {
    const mappedObject = isArray(fetchedData)
      ? fetchedData.map(parser)
      : parser(fetchedData, 0);
    return mappedObject;
  }
};

export default getDataMapper;
