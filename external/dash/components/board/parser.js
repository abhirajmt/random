import { parseConfig } from "./config";

export const parseDashboard = (
  dashboardData,
  {
    useConfigParser,
    device = "web",
    callbacks = {} /* , runtimeEnvironment = {} */,
  }
) => {
  return {
    id: dashboardData.id,
    name: dashboardData.name,
    localeUrl: dashboardData.localeUrl,
    config: useConfigParser
      ? parseConfig(dashboardData.devices[device].config)
      : dashboardData.devices[device].config,
    lanes: dashboardData.devices[device].lanes.map(
      ({ groupers, colspan: laneColspan }) => {
        return {
          colspan: laneColspan,
          groupers: groupers.map(
            ({ widgetLayouts, config, name, description }) => {
              return {
                name,
                // isVisible defaults to true for backwards compatibility
                widgetLayouts: widgetLayouts
                  // .filter(({ isVisible = true }) => isVisible)
                  .map(({ colspan, widget, externals }) => {
                    return {
                      colspan,
                      widget,
                      targetId: '.....',
                      externals: useConfigParser
                        ? parseConfig(externals)
                        : externals,
                    };
                  }),
                description,
                config: useConfigParser ? parseConfig(config) : config,
              };
            }
          ),
        };
      }
    ),
    callbacks,
  };
};
