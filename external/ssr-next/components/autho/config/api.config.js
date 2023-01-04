import { handleQueryStringForApi } from '../utils/qs';
let apiUrls = {
  getAllRolesPermissions() {
    return {
      url: '/wapi/roles',
    };
  },
};

export default handleQueryStringForApi(apiUrls);
