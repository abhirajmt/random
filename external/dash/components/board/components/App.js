/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import {
  isDashboardLoaded,
  getEventStatesCounts,
  isDashboardFailed,
  isDashboardEmpty,
  initWidgetToEventState,
  ALLOWED_EVENT_STATES,
} from "../helpers/widgetEvents";

// import "../common/components/react-base/Tailwind";
// import EmptyDashboard from "./EmptyDashboard";
// import Error from "./Error";
import Intl from "./Intl";
import Lane from "./Lane";

import styles from '../fake/dashboard.module.css';
import '../fake/dashboardV2.module.css';
import '../fake/widget.module.css';
import '../fake/widgetV2.module.css';
import '../fake/style.module.css';

// import "../style.css";

export const App = ({
  lanes,
  config: _config,
  locale,
  localeUrl,
  eventDispatcher,
  dashboardRefresher,
  isRefreshing,
  runtimeEnvironment,
  defaultConfig = {},
  ...restProps
}) => {
  const config = { ..._config, ...defaultConfig };

  const allTargetIdsRef = useRef();
  const [allWidgetsLoaded, updateAllWidgetsLoaded] = useState(false);
  const [allWidgetsHidden, updateAllWidgetsHidden] = useState(false);
  const [allVisibleWidgetsFailed, updateAllWidgetsFailed] = useState(false);
  const [widgetToEventState, updateWidgetToEventState] = useState(false);

  useEffect(() => {
    const [_allTargetIds, _widgetToEventState] = initWidgetToEventState(lanes);
    allTargetIdsRef.current = _allTargetIds;
    updateWidgetToEventState(_widgetToEventState);
  }, []);

  const allTargetIds = allTargetIdsRef.current;

  const handleWidgetEvent = event => {
    if (!ALLOWED_EVENT_STATES.includes(event.type)) return;

    const targetId = event.target.getAttribute("data-target-id");
    if (!widgetToEventState[targetId]) {
      console.warn(`Widget loaded but target id unknown: ${targetId}`, {
        widgetToEventState,
      });
    }

    updateWidgetToEventState({
      ...widgetToEventState,
      [targetId]: event.type,
    });

    const eventStatesCounts = getEventStatesCounts(
      widgetToEventState,
      allTargetIds
    );

    if (
      isDashboardFailed(widgetToEventState, allTargetIds) &&
      !allVisibleWidgetsFailed
    ) {
      eventDispatcher.dispatchFailed({
        retry: isRefreshing,
        ...eventStatesCounts,
      });
      updateAllWidgetsFailed(true);
    }
    if (
      isDashboardLoaded(widgetToEventState, allTargetIds) &&
      !allWidgetsLoaded &&
      !allVisibleWidgetsFailed
    ) {
      eventDispatcher.dispatchLoaded({
        retry: isRefreshing,
        ...eventStatesCounts,
      });
      updateAllWidgetsLoaded(true);
    }
    if (
      (lanes.length === 0 ||
        isDashboardEmpty(widgetToEventState, allTargetIds)) &&
      !allWidgetsHidden
    ) {
      eventDispatcher.dispatchNoData(eventStatesCounts);
      updateAllWidgetsHidden(true);
    }
  };

  let elementToRender;

  if (allVisibleWidgetsFailed) {
    elementToRender = '<Error onTryAgain={dashboardRefresher} />';
  } else if (allWidgetsHidden) {
    elementToRender = '<EmptyDashboard />';
  } else {
    elementToRender = (
      <div className={`lanesWrapper ${styles.grid} ${styles['grid-cols-18']} ${styles['md:gap-12']}`}>
        {lanes.map((lane, index) => (
          <Lane
            locale={locale}
            runtimeEnvironment={runtimeEnvironment}
            defaultLocaleUrl={localeUrl}
            index={index}
            {...lane}
            {...restProps}
            onWidgetTryAgain={handleWidgetEvent}
            onWidgetEmpty={handleWidgetEvent}
            onWidgetHidden={handleWidgetEvent}
            onWidgetLoaded={handleWidgetEvent}
            onWidgetFailed={handleWidgetEvent}
          />
        ))}
      </div>
    );
  }


  return (
    <div className="dashboard">
      <Intl
        locale={locale}
        localeUrl={localeUrl}
        variablesMap={runtimeEnvironment}
      >
        {elementToRender}
      </Intl>
    </div>
  );
};

export default App;
