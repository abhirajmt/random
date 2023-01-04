/* 
Input: Object of a GraphQL 'Widget' type 
Output: Copy of the object with 'Config' types converted into simple key value objects
Usecase: When the main app chooses not to parse GraphQL response at their end.
*/
import { ConfigTypeValueMapper } from "../config/constants";
import { isObject, isArray, isString, isDefined } from "../helpers";
import { ErrorCodes, ParserError } from "../errors";

const isValidElement = (key, value, type, valueTypeMap) => {
  return (
    isString(key) &&
    isString(type) &&
    isDefined(valueTypeMap[type]) &&
    isDefined(value[valueTypeMap[type]])
  );
};

const parseConfig = (
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

export { parseConfig };
