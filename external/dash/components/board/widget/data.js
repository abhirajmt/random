import nodeUrl from "url";
import { ErrorCodes, FetcherError } from "~/common/errors";
import {
  validate,
  isEmpty,
  clone,
  replaceVariablesAtKeys,
} from "~/common/helpers";
import { requestReplacementKeys } from "~/common/config/constants";

const __constructStringFromRequest = request => {
  return JSON.stringify(request);
};

const __getUrl = request => {
  const { protocol = "https", host, pathname, query } = request;
  return nodeUrl.format({ protocol, host, pathname, query });
};

const __getHeaders = headers => {
  return {
    "Content-Type": "application/json",
    ...headers,
  };
};

const escapeNewLines = (str = "") => str.replace(/\n/g, "\\n");
const __getOptions = request => {
  const options = {
    method: request.method,
    headers: __getHeaders(request.headers),
  };
  if (request.method === "POST") {
    options.body = escapeNewLines(request.body);
  }
  return options;
};

const __fetchData = async (data, url) => {
  url = url || __getUrl(data.request); // eslint-disable-line
  const options = __getOptions(data.request);

  const response = await window.fetch(url, options);

  if (!response.ok) {
    throw new FetcherError(
      `Data request failed with status ${response.status} for ${url}`,
      ErrorCodes.NETWORK_ERROR,
      response
    );
  }

  try {
    const fetchedData = await response.json();
    if (isEmpty(fetchedData))
      // eslint-disable-next-line
      console.warn(
        `Warning: empty component data received from url: ${url}`,
        fetchedData
      );
    return fetchedData;
  } catch (error) {
    throw new FetcherError(
      `Error parsing json data from ${url}`,
      ErrorCodes.INPUT_ERROR,
      error
    );
  }
};

// to insert internal variables that are not present in the env
function modifyDataSource(data, dataVariables) {
  const dataSource = clone(data);
  dataSource.request = replaceVariablesAtKeys(
    dataSource.request,
    dataVariables,
    requestReplacementKeys
  );
  return dataSource;
}

class DataFetcher {
  __dataPromise = {};

  setDataPromise = (reqString, requestObj) => {
    this.__dataPromise[reqString] = requestObj;
  };

  unsetDataPromise = reqString => {
    delete this.__dataPromise[reqString];
  };

  getDataPromise = reqString => {
    return this.__dataPromise[reqString];
  };

  async fetch(dataSource, dataVariables = {}) {
    const data = !isEmpty(dataVariables) ? modifyDataSource(dataSource, dataVariables) : dataSource;

    const { request } = data;
    const constructedString = __constructStringFromRequest(request);
    const alreadyInitiated = this.getDataPromise(constructedString);
    if (alreadyInitiated) {
      return alreadyInitiated;
    }
    validate.dataInput(data);
    const url = __getUrl(data.request);
    const requestPromise = __fetchData(data, url);
    this.setDataPromise(constructedString, requestPromise);
    try {
      const responseData = await requestPromise;
      return responseData;
    } catch (error) {
      this.unsetDataPromise(constructedString);
      throw error;
    }
  }

  clearAll() {
    this.__dataPromise = {};
  }

  clean(data) {
    const { request } = data;
    const constructedString = __constructStringFromRequest(request);
    this.unsetDataPromise(constructedString);
  }
}

const refresh = (dataSource, dataVariables) => {
  const data = !isEmpty(dataVariables) ? modifyDataSource(dataSource, dataVariables) : dataSource;
  const url = __getUrl(data.request);
  return __fetchData(data, url);
};

const instance = new DataFetcher();

instance.refresh = refresh;

export default instance;
