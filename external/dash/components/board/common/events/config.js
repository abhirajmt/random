const WIDGET_EVENTS = {
  LOADING: "widget_loading",
  FAILED: "widget_failed",
  LOADED: "widget_loaded",
  NO_DATA: "widget_empty",
  HIDDEN: "widget_hidden",
  VIEWED: "widget_viewed",
  TRY_AGAIN: "widget_try_again",
  DATA_STATE_UPDATED: "widget_data_state_updated",
};

const DASHBOARD_EVENTS = {
  LOADING: "dashboard_loading",
  FAILED: "dashboard_failed",
  LOADED: "dashboard_loaded",
  NO_DATA: "dashboard_empty",
  HIDDEN: "dashboard_hide",
  VIEWED: "dashboard_view",
  TRY_AGAIN: "dashboard_try_again",
};

const PAGE_EVENTS = {
  LOADING: "page_loading",
  FAILED: "page_failed",
  LOADED: "page_loaded",
  NO_DATA: "page_empty",
  HIDDEN: "page_hide",
  VIEWED: "page_view",
  TRY_AGAIN: "page_try_again",
};

// places where the dispatchable events need to be sent to
const DEFAULT_DISPATCH_TO_LIST = ["mixpanel"];

const WIDGET_EVENTS_TO_DISPATCH = [WIDGET_EVENTS.FAILED];

const DASHBOARD_EVENTS_TO_DISPATCH = [
  DASHBOARD_EVENTS.FAILED,
  DASHBOARD_EVENTS.NO_DATA,
];

const PAGE_EVENTS_TO_DISPATCH = [PAGE_EVENTS.FAILED, PAGE_EVENTS.NO_DATA];

const DEFAULT_EVENTS = {
  LOADING: "loading",
  FAILED: "failed",
  LOADED: "loaded",
  NO_DATA: "empty",
  HIDDEN: "hide",
  VIEWED: "view",
  TRY_AGAIN: "try-again",
};

const DASHBOARD_CONTEXT = "Dashboard";
const PAGE_CONTEXT = "Page";
const WIDGET_CONTEXT = "Widget";

export {
  WIDGET_EVENTS,
  WIDGET_EVENTS_TO_DISPATCH,
  DASHBOARD_EVENTS,
  DASHBOARD_EVENTS_TO_DISPATCH,
  PAGE_EVENTS,
  PAGE_EVENTS_TO_DISPATCH,
  DEFAULT_DISPATCH_TO_LIST,
  DEFAULT_EVENTS,
  DASHBOARD_CONTEXT,
  PAGE_CONTEXT,
  WIDGET_CONTEXT,
};
