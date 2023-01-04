const NextFederationPlugin = require("@module-federation/nextjs-mf");

const FEDERATION_HOST_AUTH="https://assets.staging.mindtickle.com/ui-auth/staging/development/remoteEntry.js"

const remotes = (isServer) => {
  const location = isServer ? "ssr" : "chunks";
  return {
    remoteCSR: "remoteCSR@http://localhost:8081/remoteEntry.js",
    remoteSSR: `remoteSSR@http://localhost:3202/_next/static/${location}/remoteEntry.js`,
    home: `home@http://localhost:3402/_next/static/${location}/remoteEntry.js`,
    // dashboard: `mt_learner_dashboard@https://localhost:8881/remoteEntry.js`,
    dashboard: `dash@http://localhost:3205/_next/static/${location}/remoteEntry.js`,
    ui_auth: `ui_auth@${FEDERATION_HOST_AUTH}`
  };
};
module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "home",
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./home": "./pages/index.js",
          './Auth': './components/Auth/hooks/index.js'
        },
        remotes: remotes(options.isServer),
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
        },
        extraOptions: {
          automaticAsyncBoundary: true,
        },
      })
    );

    return config;
  },
};
