export function getLocaleUrl(path, locale) {
  // ensure single trailing slash
  const filteredPath = path.slice(-1) === "/" ? path.slice(0, -1) : path;
  return `${filteredPath}/messages_${locale}.json`;
}

export const getTranslationsPromise = (localeUrl, locale) => {
  const url = getLocaleUrl(localeUrl, locale);
  return fetch(url).then((res) => res.json());
};