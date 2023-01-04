import { derived, writable } from "svelte/store";
import { defaultLocale } from "./constants";

export const getStores = (fetchLocale, locale) => {
  const language = writable(locale);
  const storedTranslations = derived(
    language,
    ($language, set) => {
      // don't fetch locale for english
      if ($language === defaultLocale) {
        set({});
      } else {
        fetchLocale($language).then(json => set(json || {}));
      }
      return () => {
        set = () => {}; // eslint-disable-line
      };
    },
    {}
  );
  return {
    language,
    storedTranslations,
  };
};
