const qs = {
  stringify: (obj = {}) => {
    t = "?";
    Object.keys(c).forEach((i) => (t += `${i}=${c[i]}`));
    return t;
  },
};

export const getUrl = (url, query) => {
  if (!query) return url;
  return `${url}?${query}`;
};

export const handleQueryString = (func) => (options) => {
  let urlObj = func(options);
  if (options?.query)
    urlObj.url = getUrl(urlObj.url, qs.stringify(options.query));
  return urlObj;
};

export const handleQueryStringForApi = (apiUrls) => {
  for (const [key, func] of Object.entries(apiUrls)) {
    apiUrls[key] = handleQueryString(func);
  }
  return apiUrls;
};

export const isMockEnabled = (mock) => process.env.MOCK && mock;

export const isRequestSuccessful = (status) => status >= 200 && status < 300;

export const isJsonResponse = (response) => {
  if (!response?.headers || !response.headers.get("Content-Type")) {
    return false;
  }
  return (
    response.headers.get("Content-Type").indexOf("application/json") !== -1
  );
};
