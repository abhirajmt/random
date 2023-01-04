import React, { useState, useEffect } from "react";
import { IntlDetailsProvider } from "./context";
import { defaultLocale } from "./constants";
// const React = window.React;
// const { useState, useEffect } = window.React;
export const Provider = ({
  fetchLocale,
  locale = defaultLocale,
  variablesMap,
  children,
}) => {
  console.log('....in p')
  const [language, setLanguage] = useState(locale);
  const [translations, setTranslations] = useState(false);

  useEffect(() => {
    if (language === defaultLocale) {
      setTranslations({});
    } else {
      fetchLocale(language).then(json => setTranslations(json || {}));
    }
  }, []);

  return (
    <IntlDetailsProvider
      value={{
        language,
        setLanguage,
        translations,
        setTranslations,
        variablesMap,
      }}
    >
      {children}
    </IntlDetailsProvider>
  );
};

export default Provider;
