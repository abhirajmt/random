import mockTracker from "./mockTracker";

class MockEngineEvents {
    constructor(
        target,
        eventsMap,
        eventsToDispatch,
        { id, name }
    ) {
        this.id = id;
        this.name = name;
        this.target = target;
        this.eventsMap = eventsMap;
        this.eventsToDispatch = eventsToDispatch;
    }

    __initTracking = (tracker, appName, contextName) => {
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
    };

    getBoundedTracker = () => {
        return mockTracker;
    };

    dispatchLoading = (data = {}) => {
        this.__dispatch(this.eventsMap.LOADING, data);
    };

    dispatchLoaded = (data = {}) => {
        this.__dispatch(this.eventsMap.LOADED, data);
    };

    dispatchFailed = (data = {}) => {
        const { error, /*...restData*/ } = data;
        this.__dispatch(this.eventsMap.FAILED, data);
    };

    dispatchNoData = (data = {}) => {
        this.__dispatch(this.eventsMap.NO_DATA, data);
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
    };

    destroy() {
    }
}
export default MockEngineEvents;
