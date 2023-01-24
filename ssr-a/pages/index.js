import React from "react";
import { injectScript } from "@module-federation/nextjs-mf/utils";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import Nav from "ssrB/nav";

const ViaCsrA = dynamic(() => import("csrA/Nav"), {
  ssr: false
});

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
          <Nav />
        </div>
        <div className={styles.component}>
          <p className={styles.description}>SSR App A</p>
        </div>
        <div className={styles.component}>
          <ViaCsrA />
        </div>
        <div className={styles.component}>
          <pre>{JSON.stringify(pageMap, undefined, 2)}</pre>
        </div>
      </main>
    </div>
  );
}
