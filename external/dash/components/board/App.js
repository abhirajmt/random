import GET_ACTIVE_DASHBOARD_NB from "./query";
import { parseDashboard } from "./parser";
import useRendererConfig from "./useRendererConfig";
import App from "./components/App";

const parser = (dashboard, extra) => {
  return parseDashboard(dashboard, extra);;
}

export default function Dashboard(props) {
  const rendererConfig = useRendererConfig("runtimeEnvironment");
  const extra = {
    device: 'web',
    ...rendererConfig,
  };
  const parsed = parser(props.dashboardData.props.data.user.getUser.dashboard, extra);
  console.log('>>', parsed.lanes[0].groupers[0])

  const p2p = {
    scrollContainer: extra.scrollContainer,
    useConfigParser: !!extra.useConfigParser,
    isPreviewing: !!extra.isPreviewing,
    previewOptions: !!extra.previewOptions,
    runtimeEnvironment: extra.runtimeEnvironment,
    // tracker: this.eventDispatcher.getBoundedTracker(),
    dashboardRefresher: () => {},
    isRefreshing: !!'isRefreshing',
    eventDispatcher: {},
    config: parsed.config,
    lanes: parsed.lanes,
    appName: extra.appName,
    locale: extra.locale,
    localeUrl: parsed.localeUrl,
    id: parsed.id,
    lazyLoadConfig: extra.lazyLoadConfig,
    callbacks: parsed.callbacks,
  };
  return <App {...p2p} />;
}

export const pullData = async () => {
  const body = {
    query: GET_ACTIVE_DASHBOARD_NB,
    variables: {
      isWeb: true,
      isMobile: false,
      isTablet: false,
      accessibleModules: {
        visibility: "ACCESSIBLE",
        pagination: { from: 0, size: 0 },
      },
    },
  };

  let data = await fetch("https://rxp-svc-gql.staging.mindtickle.com/graphql", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "x-token": "lHJzbgQlfi2VTwERTk21LpQtaDTTJPw0",
    },
  });
  data = await data.json();
  return {
    props: data,
  };
};

Dashboard.pullData = pullData;
