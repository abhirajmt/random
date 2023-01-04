import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
// import BlockingIntegrations from "../components/Integrations/components/BlockingIntegrations";
import Auth from "../components/Auth/Provider";
// import Dashboard, { pullData } from "dashboard/app";
import UserAuthProvider from "remoteSSR/app";

import Dashboard from "dashboard/app";

// import dynamic from 'next/dynamic';

// const Dashboard = dynamic(() => import('dashboard/app'), {
//     ssr: true
// });

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Yo Bro</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>this should be from server</div>
        <Auth {...props}>
          Holla!! use navigation pls
          <Dashboard dashboardData={props.dashboardData} />
        </Auth>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

Home.getInitialProps = async (context) => {
  const { req, query, res, asPath, pathname } = context;
  const { userAuth, error } = await UserAuthProvider.pullData({
    host: req?.headers?.host,
  });
  const dashboardData = await Dashboard.pullData();
  return { host: req?.headers?.host, userAuth, error, dashboardData };
};
