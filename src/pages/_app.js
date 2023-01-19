import App from 'next/app';
import '@/styles/globals.css';
import withReactRouter from '@/hoc/with-react-router';
import { useLocation, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const location = useLocation();
  const navigate = useNavigate();
  const router = useRouter()

  useEffect(() => {
    router.push(location.pathname, undefined, { shallow: false })
  }, [location.pathname]);

  useEffect(() => {
    navigate(router.asPath);
  }, [router.asPath]);

  return <Component {...pageProps} />
}

MyApp.getInitialProps = async ctx => {
  const appProps = await App.getInitialProps(ctx);
  return appProps;
};

export default withReactRouter(MyApp);