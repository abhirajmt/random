/* eslint-disable no-console */
// require('dotenv').config();

const https = require('http');

const accesslog = require('access-log');
const httpProxy = require('http-proxy');
const HttpProxyRules = require('http-proxy-rules');

const BASE_PATH="https://admin.staging.mindtickle.com"
const DEV_SERVER_PORT = 3402;


const proxyRules = new HttpProxyRules({
  rules: {
    '/ui/choose': `${BASE_PATH}/ui/choose`,
    '/new/ui': `https://localhost:${DEV_SERVER_PORT}/new/ui`,
    '/assets-ui': `https://localhost:${DEV_SERVER_PORT}/assets-ui`,
    '/remoteEntry.js': `https://localhost:${DEV_SERVER_PORT}/remoteEntry.js`,
    '/sw.js': `https://localhost:${process.env.SW_PORT}/sw.js`,
    '/([0-9a-z]+).hot-update': `https://localhost:${DEV_SERVER_PORT}/$1.hot-update.json`,
    '/wapi/auth': `${BASE_PATH}/wapi/auth`,
    '/graphql': 'https://rxp-svc-gql.staging.mindtickle.com/graphql',
  },
  default: 'http://localhost:3402',
});

const proxy = httpProxy.createProxy();
const port = 3400;

https
  .createServer((req, res) => {
    console.log('------------------------------------------');
    let target = proxyRules.match(req);
    console.log('target:---', target);
    accesslog(req, res);
    return proxy.web(req, res, {
      changeOrigin: true,
      target: target,
      headers: {
        'x-forwarded-host': BASE_PATH.split('//')[1],
        'x-host': req.headers.host,
      },
      secure: false,
    });
  })
  .listen(port, err => {
    if (err) {
      return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${port}`);
  });
