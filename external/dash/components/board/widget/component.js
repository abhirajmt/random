import load from "load-script2";
import { validate } from "~/common/helpers";
import {
  ErrorCodes,
  CommonError,
  FetcherError,
  RendererError,
} from "~/common/errors";

import dependencyLoader from "../dependency";

const __loadComponentFromUrl = url => {
  return load(url, {
    crossorigin: false,
    onerror: error => {
      throw new CommonError(
        `Script loading failed after fetching component url: ${url}`,
        ErrorCodes.SCRIPT_ERROR,
        error
      );
    },
  }).catch(error => {
    throw new FetcherError(
      `Error fetching component url: ${url}`,
      ErrorCodes.NETWORK_ERROR,
      error
    );
  });
};

const __loadDependencies = component => {
  return dependencyLoader.load(component);
};

const __getComponentRef = (library, name) => {
  return window[library]?.[name]?.default;
};

const __fetchComponent = async component => {
  await __loadDependencies(component);
  await __loadComponentFromUrl(component.url);
  const componentRef = __getComponentRef(component.library, component.name);

  if (!componentRef) {
    throw new RendererError(
      `Missing component at window['${component.library}']['${component.name}'].default`,
      ErrorCodes.SCRIPT_ERROR
    );
  }
  return componentRef;
};

class ComponentFetcher {
  __componentPromise = {};

  setComponentPromise = (url, promise) => {
    this.__componentPromise[url] = promise;
  };

  unsetComponentPromise = url => {
    delete this.__componentPromise[url];
  };

  getComponentPromise = url => {
    return this.__componentPromise[url];
  };

  async getComponent(component) {
    validate.componentInput(component);

    const alreadyInitiated = this.getComponentPromise(component.url);

    if (alreadyInitiated) {
      return alreadyInitiated;
    }

    this.setComponentPromise(component.url, __fetchComponent(component));

    try {
      const componentObj = await this.getComponentPromise(component.url);
      return componentObj;
    } catch (error) {
      this.unsetComponentPromise(component.url);
      throw error;
    }
  }

  clearAll() {
    this.__componentPromise = {}
  }

  clean(component) {
    this.unsetDataPromise(component?.url);
  }
}

export default new ComponentFetcher();
