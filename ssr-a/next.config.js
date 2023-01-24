const NextFederationPlugin = require("@module-federation/nextjs-mf");

const remotes = (isServer) => {
  const location = isServer ? "ssr" : "chunks";
  return {
    // ssrA: `ssrA@http://localhost:3001/_next/static/${location}/remoteEntry.js`,
    ssrB: `ssrB@http://localhost:3002/_next/static/${location}/remoteEntry.js`,
    csrA: "csrA@http://localhost:4001/remoteEntry.js"
  };
};

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "ssrA",
        filename: "static/chunks/remoteEntry.js",
        remotes: remotes(options.isServer),
        exposes: {
          //   "./nav": "./components/nav.js"
        },
        shared: {},
        extraOptions: {
          automaticAsyncBoundary: true
        }
      })
    );

    return config;
  }
};
