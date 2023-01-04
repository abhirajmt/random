import { WIDGET_EVENTS } from "../common/events/config";

const extractTargetIdsFromLanes = lanes =>
  lanes.reduce(
    (lanesAcc, { groupers }) => [
      ...lanesAcc,
      ...groupers.reduce(
        (groupersAcc, { widgetLayouts }) => [
          ...groupersAcc,
          ...widgetLayouts.reduce(
            (acc, { targetId }) => [...acc, targetId],
            []
          ),
        ],
        []
      ),
    ],
    []
  );
const { LOADING, LOADED, NO_DATA, FAILED, HIDDEN, TRY_AGAIN } = WIDGET_EVENTS;

export const initWidgetToEventState = lanes => {
  const allTargetIds = extractTargetIdsFromLanes(lanes);
  const widgetToEventState = allTargetIds.reduce(
    (acc, targetId) => ({ ...acc, [targetId]: LOADING }),
    {}
  );
  return [allTargetIds, widgetToEventState];
};
// When all visible/non-visible widgets loaded, empty or failed
export const isDashboardLoaded = (widgetEventStates, allTargetIds) =>
  allTargetIds.every(targetId =>
    [LOADED, HIDDEN, NO_DATA, FAILED].includes(widgetEventStates[targetId])
  );

export const ALLOWED_EVENT_STATES = [
  FAILED,
  LOADED,
  HIDDEN,
  NO_DATA,
  TRY_AGAIN,
];
export const getEventStatesCounts = (widgetEventStates, allTargetIds) =>
  allTargetIds.reduce((acc, targetId) => {
    const state = widgetEventStates[targetId];
    return {
      ...acc,
      [`${state}_count`]: (acc[`${state}_count`] || 0) + 1,
    };
  }, {});

// When all visible widgets failed
export const isDashboardFailed = (widgetEventStates, allTargetIds) =>
  allTargetIds.every(targetId =>
    [FAILED, HIDDEN].includes(widgetEventStates[targetId])
  );

// When there are no visible widgets
export const isDashboardEmpty = (widgetEventStates, allTargetIds) =>
  allTargetIds.every(targetId => widgetEventStates[targetId] === HIDDEN);
