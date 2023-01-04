const ENVIRONMENT = {
  REACT: "react",
  VUE: "vue",
  VANILLA: "vanilla",
};

const variant =
  process.env.NODE_ENV === "production" ? "production.min" : "development";

const DEPENDENCY_DETAILS = {
  [ENVIRONMENT.REACT]: {
    PropTypes: {
      aliases: ["prop-types"],
      // url: "https://unpkg.com/prop-types@15.7.2/prop-types.min.js",
      url: `${process.env.PUBLIC_PATH}/assets/prop-types@15.7.2.js`,
    },
    styled: {
      aliases: ["styled-components"],
      // url: "https://cdnjs.cloudflare.com/ajax/libs/styled-components/3.5.0-0/styled-components.js",
      url: `${process.env.PUBLIC_PATH}/assets/styled-components@3.5.0-0.js`,
    },
    IntersectionObserver: {
      aliases: ["intersection-observer"],
      // url: "https://cdn.jsdelivr.net/npm/intersection-observer@0.11.0/intersection-observer.js",
      url: `${process.env.PUBLIC_PATH}/assets/intersection-observer@0.11.0.js`,
    },
  },
  [ENVIRONMENT.VUE]: {},
  [ENVIRONMENT.VANILLA]: {},
};

const ENVIRONMENT_DEPENDENCIES = {
  [ENVIRONMENT.REACT]: [
    // Note: These two are already loaded in widget renderer now -
    {
      name: "React",
      aliases: ["react"],
      // url: `https://unpkg.com/react@17.0.2/umd/react.${variant}.js`,
      url: `${process.env.PUBLIC_PATH}/assets/react@17.0.2/react.${variant}.js`,
      options: { crossorigin: true },
    },
    {
      name: "ReactDOM",
      aliases: ["react-dom"],
      // url: `https://unpkg.com/react-dom@17.0.2/umd/react-dom.${variant}.js`,
      url: `${process.env.PUBLIC_PATH}/assets/react-dom@17.0.2/react-dom.${variant}.js`,
      options: { crossorigin: true },
    },
    {
      name: "ReactIs",
      aliases: ["react-is"],
      // url: `https://unpkg.com/react-is@17.0.2/umd/react-is.${variant}.js`,
      url: `${process.env.PUBLIC_PATH}/assets/react-is@17.0.2/react-is.${variant}.js`,
      options: { crossorigin: true },
    },
  ],
  [ENVIRONMENT.VUE]: [],
  [ENVIRONMENT.VANILLA]: [],
};

// Dependencies already loaded by widget-engine for IntlProvider, etc
const ALREADY_IMPORTED_DEPENDENCIES = ["React", "ReactDOM"];

export {
  ENVIRONMENT,
  DEPENDENCY_DETAILS,
  ENVIRONMENT_DEPENDENCIES,
  ALREADY_IMPORTED_DEPENDENCIES,
};
