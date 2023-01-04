import { handleQueryStringForApi } from '../../../utils/qs';

let apiUrls = {
  checkAuth({ baseDomain, localeForApps = [] } = {}) {
    return {
      url: `${baseDomain || ''}/wapi/auth?localeForApps=${localeForApps.join(',')}`,
    };
  },
  logout(userId) {
    return {
      url: `/logout?_=${Date.now()}`,
    };
  },
};

export default handleQueryStringForApi(apiUrls);
