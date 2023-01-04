// Note: these are also imported by mt-widgets-shared
export const ConfigTypeValueMapper = {
  TEXT: "stringValue",
  BOOL: "boolValue",
};

// These paths denote Config types in gql schema
export const widgetConfigPaths = [
  "config",
  "data.config",
  "data.request.headers",
  "data.request.query",
  "layout.config",
  "data.request.environment",
  "layout.environment",
  "environment.widget",
  "environment.layout",
  "environment.request",
];
export const INTERNAL_VARS = {
  WIDGET_NAME_LEARNER: "__widget_name_learner__",
  WIDGET_DESCRIPTION_LEARNER: "__widget_description_learner__",
};
// Keys subject to variable replacement
export const requestReplacementKeys = [
  "host",
  "pathname",
  "query",
  "headers",
  "body",
];

export const ENVIRONMENT_PATHS = {
  // empty path for widget level
  WIDGET: "",
  REQUEST: "data.request",
  LAYOUT: "layout",
  COMPONENT: "layout.component",
};

export const layoutReplacementKeys = ["config"];
export const componentReplacementKeys = ["url"];
export const widgetReplacementKeys = ["name", "description", "config"];

export const environmentReplacements = {
  [ENVIRONMENT_PATHS.WIDGET]: {
    replacementKeys: widgetReplacementKeys,
    envStack: ["environment.widget"],
  },
  [ENVIRONMENT_PATHS.REQUEST]: {
    replacementKeys: requestReplacementKeys,
    options: { skipUndefined: true },
    envStack: [
      "data.request.environment",
      "environment.request",
      "environment.widget",
    ],
  },
  [ENVIRONMENT_PATHS.LAYOUT]: {
    replacementKeys: layoutReplacementKeys,
    envStack: [
      "layout.environment",
      "environment.layout",
      "environment.widget",
    ],
  },
  [ENVIRONMENT_PATHS.COMPONENT]: {
    replacementKeys: componentReplacementKeys,
    envStack: [
      "layout.environment",
      "environment.layout",
      "environment.widget",
    ],
  },
};
