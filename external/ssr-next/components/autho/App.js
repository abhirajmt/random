import React, { PureComponent } from 'react';

//[TODO] change import and consume from core-helpers
import { isAdminSite } from './utils';
// import { isEmpty, reload } from '@mindtickle/utils';

// import { APPLICATIONS, getApplicationAccessLink } from 'ui_shell/ApplicationUrls';

import AdminAuth from './containers/AdminAuth/index';
import LSAuth, { checkAuth } from './containers/LSAuth/index';
import { getAdminSideUserAuth, getLSUserAuth } from './utils/mapper';
import { DEFAULT_ERROR_FALLBACK, RESTRICT_IMPERSONATION_URL } from './config/constants';

const Context = React.createContext();

class AuthProvider extends PureComponent {

  state = {};

  constructor(props) {
    super(props);
    this.getAuthComponent = this._getAuthComponent;
  }

  _getAuthComponent = (host) => (isAdminSite(host) ? AdminAuth : LSAuth);

  onAuthLoaded = ({ auth, error }) => {
    this.setState({ userAuth: auth, error });
  };

  render() {
    let { children, isOld, localeForApps, host, userAuth, error } = this.props;
    // const { userAuth, error } = this.state;

    const AuthComponent = this.getAuthComponent(host);

    // let isLoggedIn = !isEmpty(userAuth) && isEmpty(error);

    let isLoggedIn = true;

    if (!isAdminSite(host)) {
      isLoggedIn = isLoggedIn && !userAuth?.error;
    }

    // if (error?.statusCode === 401) {
    //   // [TODO] uncomment this post invite workflow has been moved to federation
    //   // reload(getApplicationAccessLink(APPLICATIONS.LOGIN));

    //   reload('/login');
    // }

    // if (isAdminSite() && !isEmpty(userAuth)) {
    //   const { pathname } = window?.location || {};
    //   const { user: { delegation: { delegated, type } = {} } = {} } = userAuth;
    //   if (delegated && type === 'USER_IMPERSONATION' && pathname !== RESTRICT_IMPERSONATION_URL) {
    //     reload(RESTRICT_IMPERSONATION_URL);
    //   }
    // }

    return (
      <>
        <AuthComponent
          onAuthLoaded={this.onAuthLoaded}
          error={error}
          baseDomain={this.props.baseDomain}
          localeForApps={localeForApps}
          host={host}
        />
        {userAuth && (
          <Context.Provider value={mapAuth(userAuth, isOld, { isLoggedIn }, host)}>
            {children}
          </Context.Provider>
        )}
      </>
    );
  }
}

const mapAuth = (auth, isOld, extra = {}, host) => {
  let userAuth = auth;
  if (isOld) {
    userAuth = {
      userAuth: isAdminSite(host) ? getAdminSideUserAuth(auth) : getLSUserAuth(auth),
    };
  }
  Object.keys(extra).forEach(key => (userAuth[key] = extra[key]));
  return userAuth;
};

AuthProvider.pullData = async ({ host }) => {
  try {
    const auth = await checkAuth({
      baseDomain: 'https://incubation.mindtickle.com',
      localeForApps: [],
      host: 'https://incubation.mindtickle.com',
    });
    return {userAuth: auth }
  } catch (error) {
    return { error };
  }
}

export { Context };
export default AuthProvider;
