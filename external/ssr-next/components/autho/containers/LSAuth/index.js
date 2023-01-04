import { Component } from 'react';
// import PropTypes from 'prop-types';

// import withErrorHandler from '@mindtickle/hocs/withErrorHandler';

// import ErrorHandler from '../../components/ErrorHandler';

import AuthService from './api/login';

class Auth extends Component {
  static defaultProps = {
    onAuthLoaded: () => null,
  };

  // async componentDidMount() {
  //   try {
  //     const auth = await AuthService.checkAuth({
  //       baseDomain: this.props.baseDomain,
  //       localeForApps: this.props.localeForApps,
  //       host: this.props.host,
  //     });
  //     this.props.onAuthLoaded({ auth });
  //   } catch (error) {
  //     this.props.onAuthLoaded({ error });
  //   }
  // }

  render() {
    return null;
  }
}

const logout = AuthService.logout;
const checkAuth = AuthService.checkAuth;

// export default withErrorHandler(ErrorHandler)(Auth);
export default Auth;

export { logout, checkAuth };
