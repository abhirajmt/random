import React from 'react';
import {BrowserRouter} from 'react-router-dom';
const isServer = typeof window === 'undefined';

export default (App) => {
  return class AppWithReactRouter extends React.Component {
    static async getInitialProps(appContext) {
      const {
        pathname = '/'
      } = appContext;
      return {
        pathname,
      };
    }


    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        this.onRouteChanged();
      }
    }
  
    onRouteChanged() {
      console.log("ROUTE CHANGED");
    }

    render() {
      if (isServer) {
        const {StaticRouter} = require('react-router-dom/server');
        return (
          <StaticRouter
            location={this.props.pathname}
          >
            <App {...this.props} />
          </StaticRouter>
        );
      }
      return (
        <BrowserRouter>
          <App {...this.props} />
        </BrowserRouter>
      );
    }
  };
};
