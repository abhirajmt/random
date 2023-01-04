//@ts-ignore
import ErrorPage, { PAGE_TYPES } from '@mindtickle/error-page';
//@ts-ignore
import Loader from '@mindtickle/loader';

import { generateErrorFallback } from '../utils';
import ENV from '~/config/env';

export const NAMESPACE = 'ui-shell';
export const APP_NAME = 'ui-shell';

export const DEFAULT_ERROR_FALLBACK = generateErrorFallback(() => (
  <ErrorPage
    tryAgain={() => window.location?.reload()}
    centered={true}
    pageType={PAGE_TYPES.CLIENT_ERROR}
    showGoToHome={false}
    showLogo={false}
  />
));

export const DEFAULT_DELAYED_FALLBACK = () => <Loader type="Full" />;

export const ROUTES_NAMESPACE = 'new/ui/*';
export const SHAREABLE_ROUTE_PREFIX_PATH = 'sh/:userInteractionId/*';

export const REMOTE_FILE = `${ENV.FEDERATION_REMOTE_FILE_NAME}.js`;

const getRemoteUrl = (path) => `${path}/${REMOTE_FILE}`;

export const DYNAMIC_REMOTES = {
  ADMIN_HEADER: {
    remoteName: 'admin_header',
    moduleName: './App',
    url: getRemoteUrl(ENV.FEDERATION_HOST_ADMIN_HEADER),
    appName: 'admin-header',
  },
  LEARNER_HEADER: {
    remoteName: 'learner_header',
    moduleName: './App',
    url: getRemoteUrl(process.env.FEDERATION_HOST_LEARNER_HEADER),
    appName: 'learner-header',
  },
  LEARNER_SIDEBAR: {
    remoteName: 'learner_header',
    moduleName: './sidebar/App',
    url: getRemoteUrl(process.env.FEDERATION_HOST_LEARNER_HEADER),
    appName: 'learner-header',
  },
};
