import { createContext } from "react";

const IntlDetailsContext = createContext({
  language: {},
  translations: {},
  variablesMap: {},
  setLanguage: () => {},
  setTranslations: () => {},
});
const IntlDetailsProvider = IntlDetailsContext.Provider;

export { IntlDetailsProvider, IntlDetailsContext };
