const NextFederationPlugin = require('@module-federation/nextjs-mf');

const remote_file = `remoteEntry.js`;
const FEDERATION_HOST_SHELL = 'https://assets.staging.mindtickle.com/ui-shell/staging/development';

const remotes = isServer => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    dash: `dash@http://localhost:3205/_next/static/${location}/remoteEntry.js`,
    ssrshell: `home@http://localhost:3402/_next/static/${location}/remoteEntry.js`,
    // shell: `ui_shell@${FEDERATION_HOST_SHELL}/${remote_file}`,
  };
};
module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'dash',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './home': './pages/index.js',
          './app': './components/board/App.js',
        },
        remotes: remotes(options.isServer),
        shared: {},
        extraOptions:{
          automaticAsyncBoundary: true
        }
      }),
    );

    return config;
  },
};
