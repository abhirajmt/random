export const CONFIG_FRAG = `
fragment valueFrag on ConfigValue{
  ... on BoolValue{
    boolValue
  }
  ... on StringValue{
    stringValue
  }
}
fragment configFrag on Config{
  key,
  type,
  value{...valueFrag}
}
`;

export const COMPONENT_FRAG = `
fragment componentFrag on Component{
  id
  url
  name
  library
  type
  dependencies
  isPublished
}
`;

// To import multiple fragments, compose the query using pure fragments. Example usecase: GET_WIDGET
// Note: pure fragments are not standalone.
export const REQUEST_FRAG_PURE = `
fragment requestFrag on Request{
  method,
  protocol,
  host,
  pathname,
  headers{...configFrag},
  query{...configFrag},
  environment{...configFrag},
  ... on PostRequest{
    body
  }
}`;

export const DATA_FRAG_PURE = `
fragment dataFrag on DataSource{
  id
  name
  description
  request{...requestFrag}
}
`;

export const LAYOUT_FRAG_PURE = `
fragment layoutFrag on Layout{
  id
  name
  description
  localeUrl
  component{...componentFrag}
  config{...configFrag}
  environment{...configFrag}
}
`;

export const ENV_VARS_FRAG_PURE = `
fragment widgetEnvFrag on EnvVars{
  widget {...configFrag}
  request {...configFrag}
  layout {...configFrag}
}
`;

// for getWidget
export const WIDGET_FRAG_PURE = `
fragment widgetFrag on Widget{
  id
  name
  description
  learnerName
  learnerDescription
  mapper {
    mapTo
    mapPath
    isOptional
  }
  stateMapper {
    mapTo
    mapPath
  }
  data {...dataFrag}
  layout {...layoutFrag}
  config {...configFrag}
  environment {...widgetEnvFrag}
  localeUrl
}
`;

// for getWidget
export const DASHBOARD_WIDGET_FRAG_PURE = `
fragment widgetFrag on DashboardWidget{
  id
  name
  description
  learnerName
  learnerDescription
  mapper {
    mapTo
    mapPath
    isOptional
  }
  stateMapper {
    mapTo
    mapPath
  }
  data {...dataFrag}
  layout {...layoutFrag}
  config {...configFrag}
  environment {...widgetEnvFrag}
  localeUrl
}
`;

export const DEVICE_FRAG_PURE = `
fragment deviceFrag on Device {
  config {
    ...configFrag
  }
  lanes {
    colspan
    groupers {
      config {
        ...configFrag
      }
      widgetLayouts {
        isVisible
        colspan
        externals {
          ...configFrag
        }
        widget {
          ...widgetFrag
        }
      }
    }
  }
}
`;

// These fragments are composition of pure fragments -
export const REQUEST_FRAG = `
  ${CONFIG_FRAG}
  ${REQUEST_FRAG_PURE}
`;

export const DATA_FRAG = `
  ${CONFIG_FRAG}
  ${REQUEST_FRAG_PURE}
  ${DATA_FRAG_PURE}
`;
export const LAYOUT_FRAG = `
  ${CONFIG_FRAG}
  ${COMPONENT_FRAG}
  ${LAYOUT_FRAG_PURE}
`;

export const WIDGET_FRAG = `
  ${CONFIG_FRAG}
  ${COMPONENT_FRAG}
  ${LAYOUT_FRAG_PURE}
  ${REQUEST_FRAG_PURE}
  ${DATA_FRAG_PURE}
  ${ENV_VARS_FRAG_PURE}
  ${WIDGET_FRAG_PURE}
`;

export const DEVICE_FRAG = `
  ${CONFIG_FRAG}
  ${COMPONENT_FRAG}
  ${LAYOUT_FRAG_PURE}
  ${REQUEST_FRAG_PURE}
  ${DATA_FRAG_PURE}
  ${ENV_VARS_FRAG_PURE}
  ${DASHBOARD_WIDGET_FRAG_PURE}
  ${DEVICE_FRAG_PURE}
`;
