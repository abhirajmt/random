import {
  validate,
  applyAtPaths,
  clone,
  isEmpty,
  replaceVariablesAtKeys,
  findValueAtPath,
  createFullEnvironment,
  setValueAtPath,
  isDefined,
  replaceVariablesOnSubject,
} from "./common/helpers";
import {
  widgetConfigPaths,
  environmentReplacements,
  INTERNAL_VARS,
  ENVIRONMENT_PATHS,
} from "./common/config/constants";
import deepmerge from './common/helpers/deepmerge';
import { parseConfig } from "./common/parsers/config";

const overrideWidgetEnvironment = (parsedWidget, externals) => {
  const widgetEnv = parsedWidget.environment?.widget || {};

  // create path only if it should exist
  if (isEmpty(widgetEnv) && isEmpty(externals)) return parsedWidget;

  const widgetWithEnvironment = {
    ...parsedWidget,
    environment: {
      ...parsedWidget.environment,
      widget: deepmerge(widgetEnv, externals),
    },
  };
  return widgetWithEnvironment;
};

/**
 * Apply variable replacements on request, layout, etc
 * Strings : "{{a}}"
 */
const validateAndApplyEnvironments = (
  widgetWithEnvironment,
  skipEnvironmentValidations
) => {
  let replacedWidget = clone(widgetWithEnvironment);
  const variablesMap = {};
  // replace variables at subject paths
  Object.entries(environmentReplacements).forEach(
    ([path, { replacementKeys, envStack, options }]) => {
      const [pathVal] = findValueAtPath(replacedWidget, path);

      const fullEnvironment = createFullEnvironment(replacedWidget, envStack);
      if (!(skipEnvironmentValidations || options?.skipUndefined)) validate.environmentInput(pathVal, fullEnvironment);
      variablesMap[path] = fullEnvironment;
      // Note: one more replacement will happen for translated messages.
      const replacedPathVal = replaceVariablesAtKeys(
        pathVal,
        fullEnvironment,
        replacementKeys,
        options
      );

      if (path === ENVIRONMENT_PATHS.WIDGET) {
        // inject dynamic name and description from special variables in the environment
        // Note: all values in fullEnvironment are recursively replaced.
        const {
          [INTERNAL_VARS.WIDGET_NAME_LEARNER]: dynamicName,
          [INTERNAL_VARS.WIDGET_DESCRIPTION_LEARNER]: dynamicDescription
        } = fullEnvironment;

        if (dynamicName)
          replacedPathVal.dynamicName = replaceVariablesOnSubject(dynamicName, fullEnvironment);
        if (dynamicDescription)
          replacedPathVal.dynamicDescription = replaceVariablesOnSubject(dynamicDescription, fullEnvironment);
      }

      // empty path case: replace full object
      if (path === "") replacedWidget = replacedPathVal;
      // for other cases: replace value at path
      else setValueAtPath(replacedWidget, path, replacedPathVal);
    }
  );

  return [replacedWidget, variablesMap];
};

const applyDefaults = (parsedWidget) => {
  const { name, description, stateMapper, learnerName, learnerDescription } = parsedWidget;
  return {
    ...parsedWidget,
    stateMapper: isDefined(stateMapper) ? stateMapper : [],
    learnerName: isDefined(learnerName) ? learnerName : name,
    learnerDescription: isDefined(learnerDescription) ? learnerDescription : description,
  };
}

/*
Note: Output of parseWidget shall not contain any variables when parsed without errors.
*/
const parseWidget = (
  widgetData,
  extra,
  options = {}
) => {
  const { useConfigParser, externals = {} } = extra;
  const { skipEnvironmentValidations = false, callbacks } = options;
  // preliminary checks
  validate.widgetDataInput(widgetData);
  validate.callbacks(callbacks);

  const originalWidget = useConfigParser ? applyAtPaths(widgetData, widgetConfigPaths, parseConfig) : widgetData;
  // checks after parsing
  validate.parsedWidgetInput(originalWidget);

  const overridenWidget = overrideWidgetEnvironment(originalWidget, externals);

  // Note: all variables will be replaced after this point (except in translated messages)
  const [envAppliedWidget, variablesMap] = validateAndApplyEnvironments(overridenWidget, skipEnvironmentValidations);

  const parsedWidget = applyDefaults(envAppliedWidget);

  return [originalWidget, parsedWidget, variablesMap];
};

export default parseWidget;