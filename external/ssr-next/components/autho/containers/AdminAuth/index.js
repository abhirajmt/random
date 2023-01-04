import { Component } from 'react';

// import withErrorHandler from '@mindtickle/hocs/withErrorHandler';

// import ErrorHandler from '../../components/ErrorHandler';
import AuthService from './api/auth';

class Auth extends Component {

  static defaultProps = {
    onAuthLoaded: () => null,
  };

  async componentDidMount() {
    try {
      const auth = await AuthService.auth({
        baseDomain: this.props.baseDomain,
        localeForApps: this.props.localeForApps,
      });
      this.props.onAuthLoaded({ auth });
    } catch (error) {
      this.props.onAuthLoaded({ error });
    }
  }

  render() {
    return null;
  }
}
const logout = AuthService.logout;

// export default withErrorHandler(ErrorHandler)(Auth);
export default Auth;

export { logout };
