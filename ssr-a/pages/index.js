import React from "react";
import { injectScript } from "@module-federation/nextjs-mf/utils";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import Nav from "ssrB/nav";

const ViaCsrA = dynamic(() => import("csrA/Nav"), {
  ssr: false
});

const NavRuntime = dynamic(() => import("ssrB/nav"));

export default function Home() {
  //   const Nav = dynamic(
  //     () => {
  //       return import("ssrB/nav");
  //     },
  //     { ssr: false }
  //   );

  const [pageMap, setPageMap] = React.useState("");

  React.useEffect(() => {
    injectScript("ssrB")
      .then((container) => container.get("./data"))
      .then((data) => {
        setPageMap(data);
      });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>SSR A</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.component}>
          via static import
          <Nav />
        </div>
        <div className={styles.component}>this app - SSR App A</div>
        <div className={styles.component}>
          from CSR-a app
          <ViaCsrA />
        </div>
        <div className={styles.component}>
          fetched via injectScript
          <pre>{JSON.stringify(pageMap, undefined, 2)}</pre>
        </div>
        <div className={styles.component}>
          fetching from ssr B at runtime
          <NavRuntime />
        </div>
      </main>
    </div>
  );
}
