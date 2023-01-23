const NextFederationPlugin = require("@module-federation/nextjs-mf");

module.exports = {
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: "ssrB",
          filename: "static/chunks/remoteEntry.js",
          remotes: {
            // ssrB: "ssrB@http://localhost:3002/_next/static/chunks/remoteEntry.js"
          },
          exposes: {
            "./nav": "./components/nav.js"
          },
          shared: {}
        })
      );
    }

    return config;
  }
};
