import React from "react";
import Provider from "../../common/components/react-base/Intl/Provider";
import { getTranslationsPromise } from "../../common/helpers/url";

export const Intl = ({ children, localeUrl, ...restProps }) => {
  const fetchLocale = language => {
    return getTranslationsPromise(localeUrl, language);
  };

  return (
    <Provider fetchLocale={fetchLocale} {...restProps}>
      {children}
    </Provider>
  );
};

export default Intl;
