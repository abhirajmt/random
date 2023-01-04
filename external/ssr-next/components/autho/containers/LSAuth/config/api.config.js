import { handleQueryStringForApi } from '../../../utils/qs';
let apiUrls = {
  checkAuth({ baseDomain, localeForApps = [] } = {}) {
    return {
      url: `${baseDomain || ''}/wapi/auth?localeForApps=${localeForApps.join(',')}`,
      mockType: 'success',
      // mockType: "invalid"
    };
  },
  logout() {
    return {
      url: `/logout?_=${Date.now()}`,
      mock: 'logout',
    };
  },
};

export default handleQueryStringForApi(apiUrls);
