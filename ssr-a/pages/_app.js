import "antd/dist/antd.css";

import App from "next/app";
import dynamic from "next/dynamic";

const Nav = dynamic(() => import("../components/nav"));

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Nav />
      <Component {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async (ctx) => {
  const appProps = await App.getInitialProps(ctx);
  return appProps;
};

export default MyApp;
