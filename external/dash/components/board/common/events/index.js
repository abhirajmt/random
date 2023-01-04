import { DEFAULT_EVENTS, DEFAULT_DISPATCH_TO_LIST } from "./config";
import { isValidTracker } from "./helper";

import "custom-event-polyfill";

const getAdditionalData = (eventsToDispatch, eventName) => {
  const newProperties = {};
  if (eventsToDispatch.includes(eventName)) {
    newProperties.dispatchTo = DEFAULT_DISPATCH_TO_LIST;
  }
  return newProperties;
};

class EngineEvents {
  constructor(
    target,
    eventsMap = DEFAULT_EVENTS,
    eventsToDispatch = [],
    { id, contextId, name, staticContext, tracker, appName, contextName } = {}
  ) {
    this.id = id;
    this.contextId = contextId;
    this.name = name;
    this.target = target;
    this.staticContext = staticContext;
    this.eventsMap = eventsMap;
    this.eventsToDispatch = eventsToDispatch;

    this.__initTracking(tracker, appName, contextName);
  }

  __initTracking = (tracker, appName, contextName) => {
    if (isValidTracker(tracker) && contextName) {
      this.tracker = tracker;

      this.eventDetails = {
        category: appName,
        label: this.name,
      };

      this.contextWithId = {
        ...tracker.getPlatformContexts()[contextName],
        // Note: this id is limited to store access and has no relation with the id passed to enricher.
        //       the entity id for enricher is to be returned via contextGetter.
        id: this.contextId,
      };

      // injectContext adds it to store with some identifier
      tracker.injectContext(this.contextWithId, () => this.staticContext);

      // boundTrackers will return a new instance with the new attached context
      this.tracker = tracker.boundTrackers([this.contextWithId]);
    }
  };

  __dispatch = (eventName, data) => {
    this.target.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {
          id: this.id,
          name: this.name,
          target: this.target,
          ...data,
        },
      })
    );
  };

  __track = (eventName, data) => {
    if (this.tracker) {
      const eventData = {
        ...data,
        properties: {
          ...data.properties,
          ...getAdditionalData(this.eventsToDispatch, eventName),
        },
      };
      this.tracker.trackStructuredEvent(eventName, eventData);
    }
  };

  getBoundedTracker = () => {
    return this.tracker;
  };

  dispatchLoading = (data = {}) => {
    this.__dispatch(this.eventsMap.LOADING, data);
  };

  dispatchLoaded = (data = {}) => {
    this.__dispatch(this.eventsMap.LOADED, data);
    this.__track(this.eventsMap.LOADED, {
      ...this.eventDetails,
      properties: { ...data },
    });
  };

  dispatchFailed = (data = {}) => {
    const { error, ...restData } = data;
    this.__dispatch(this.eventsMap.FAILED, data);
    this.__track(this.eventsMap.FAILED, {
      ...this.eventDetails,
      properties: {
        widget_error: error,
        ...restData,
      },
    });
  };

  dispatchNoData = (data = {}) => {
    this.__dispatch(this.eventsMap.NO_DATA, data);
    this.__track(this.eventsMap.NO_DATA, this.eventDetails);
  };

  dispatchHide = (data = {}) => {
    this.__dispatch(this.eventsMap.HIDDEN, data);
  };

  dispatchTryAgain = (data = {}) => {
    this.__dispatch(this.eventsMap.TRY_AGAIN, data);
  };

  dispatchDataStateUpdated = (data = {}) => {
    this.__dispatch(this.eventsMap.DATA_STATE_UPDATED, data);
  };

  dispatchViewed = (data = {}) => {
    this.__dispatch(this.eventsMap.VIEWED, data);
    this.__track(this.eventsMap.VIEWED, this.eventDetails);
  };

  destroy() {
    if (this.tracker) {
      this.tracker.ejectContext(this.contextWithId);
    }
  }
}
export default EngineEvents;
