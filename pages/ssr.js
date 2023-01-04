import SSRPage from 'remoteSSR/home';
const SSR = SSRPage;
SSR.getInitialProps = SSRPage.getInitialProps;
export default SSR;
