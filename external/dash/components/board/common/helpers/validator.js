import { ErrorCodes, FetcherError, ParserError } from "../errors";
import {
  isDefined,
  isObject,
  isNull,
  isString,
  isEmpty,
  isArray,
  isFunction,
} from "./common";
import { findValueAtPath } from "./parser";
import { extractVariables } from "./overrides";
import { widgetConfigPaths, INTERNAL_VARS } from "../config/constants";

/*
Inputs: 
  data : The data object to parse
  paths : Array of dot-concatenated paths to check at
  onNotDefined : A function that executes on an undefined or null value
  onNull : A function that executes on a null value
  onAny : A function that executes on any value

Output: None 
  Corresponding function from inputs is called when its criterion is met.

*/
const callAtPaths = (data, paths, { onAny, onNull, onNotDefined }) => {
  paths.forEach(path => {
    const [pointer, lastKey] = findValueAtPath(data, path);
    if (onNotDefined && !isDefined(pointer))
      onNotDefined(path, lastKey, pointer);
    if (onNull && isNull(pointer)) onNull(path, lastKey);
    if (onAny) onAny(pointer, path, lastKey);
  });
};

const widgetDataInput = widgetData => {
  if (!isDefined(widgetData)) {
    throw new ParserError(`widgetData is not defined`, ErrorCodes.INPUT_ERROR, {
      widgetData,
    });
  }
};

// Note: parsedWidget will not have overriden environments.
const parsedWidgetInput = parsedWidget => {
  callAtPaths(
    parsedWidget,
    ["name", "mapper", "data", "layout", "data.request", "layout.component"],
    {
      onNotDefined: path => {
        throw new ParserError(
          `In Widget: '${path}' is required for in widget data`,
          ErrorCodes.INPUT_ERROR,
          { parsedWidget }
        );
      },
    }
  );

  callAtPaths(parsedWidget, widgetConfigPaths, {
    onAny: (value, path, lastKey) => {
      if (isDefined(value)) {
        if (!isObject(value)) {
          throw new ParserError(
            `Value exists in parsed widget but is not an object for key ${lastKey}`,
            ErrorCodes.INPUT_ERROR,
            { value, path }
          );
        }
      }
    },
  });

  // Check that all config types are parsed
  callAtPaths(
    parsedWidget,
    [
      "config",
      "environment",
      "environment.request",
      "environment.layout",
      "data.request.query",
      "data.request.environment",
      "layout.config",
      "layout.environment",
    ],
    {
      // undefined accepted, but not null/non-object
      onAny: (value, path, lastKey) => {
        if (isDefined(value)) {
          if (!isObject(value)) {
            throw new ParserError(
              `In parsedWidget: Value exists but is not an object for key ${lastKey}`,
              ErrorCodes.INPUT_ERROR,
              { path, value }
            );
          }
        }
      },
    }
  );
};

const componentInput = component => {
  callAtPaths(component, ["name", "url", "library", "type", "dependencies"], {
    onNotDefined: (path, lastKey) => {
      throw new FetcherError(
        `componentInput: field '${lastKey}' missing when checking path: 'component.${path}'`,
        ErrorCodes.INPUT_ERROR,
        { component }
      );
    },
  });
};

const dataInput = data => {
  callAtPaths(
    data,
    ["request.method", "request.protocol", "request.host", "request.pathname"],
    {
      onNotDefined: (path, lastKey) => {
        throw new FetcherError(
          `dataInput: field '${lastKey}' missing when checking path: 'data.${path}'`,
          ErrorCodes.INPUT_ERROR,
          { data }
        );
      },
    }
  );
};

const mapperOnly = mapper => {
  // Validate mapper

  if (!isArray(mapper)) {
    throw new ParserError(
      `mapperInput: Mapper should be an array`,
      ErrorCodes.INPUT_ERROR,
      { mapper }
    );
  }
  mapper.forEach((elem, index) => {
    const { mapPath, mapTo } = elem;
    // check for presence of mapTo and mapPath
    if (
      !isString(mapPath) ||
      isEmpty(mapPath) ||
      !isString(mapTo) ||
      isEmpty(mapTo)
    ) {
      throw new ParserError(
        `mapperInput: Non-String/empty attributes for mapper[${index}]`,
        ErrorCodes.INPUT_ERROR,
        { elem }
      );
    }
    // validate array notations
    const fromArrays = mapPath.split("[]");
    const correctedMapTo = mapTo.endsWith("[]") ? mapTo.slice(0, -2) : mapTo;
    const toArrays = correctedMapTo.split("[]");
    if (fromArrays.length < toArrays.length) {
      throw new ParserError(
        `mapperInput: mapTo has deeper array nesting than mapPath. mapTo: '${mapTo}' mapPath: '${mapPath}'`,
        ErrorCodes.INPUT_ERROR,
        { elem }
      );
    }
  });
};

const validateEnvOnString = (string, environment) => {
  const variables = extractVariables(string);
  variables.forEach(variable => {
    if (
      !Object.values(INTERNAL_VARS).includes(variable) && // internal variable
      !isDefined(environment[variable])
    ) {
      throw new ParserError(
        `No value provided in environment for variable "${variable}"`,
        ErrorCodes.INPUT_ERROR,
        { string, environment }
      );
    }
  });
};

const environmentInput = (subject, fullEnvironment = {}) => {
  if (isObject(subject)) {
    Object.keys(subject).forEach(key => {
      if (isString(subject[key]))
        validateEnvOnString(subject[key], fullEnvironment);
    });
  } else if (isString(subject)) {
    validateEnvOnString(subject, fullEnvironment);
  }
};

const callbacks = callbacksObj => {
  if (!isDefined(callbacksObj)) {
    return;
  }

  if (!isObject(callbacksObj)) {
    throw new ParserError(
      `'callbacks' must be an Object`,
      ErrorCodes.INVALID_CALLBACK_ERROR,
      callbacksObj
    );
  }

  Object.keys(callbacksObj).forEach(callback => {
    if (
      isDefined(callbacksObj[callback]) &&
      !isFunction(callbacksObj[callback])
    ) {
      throw new ParserError(
        `supplied callback '${callback}' is not a function`,
        ErrorCodes.INVALID_CALLBACK_ERROR,
        callbacksObj
      );
    }
  });
};

const validate = {
  widgetDataInput,
  parsedWidgetInput,
  componentInput,
  dataInput,
  mapperOnly,
  environmentInput,
  callbacks,
};
export { validate };
