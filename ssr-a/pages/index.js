import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";

export default function Home() {
  const Nav = dynamic(
    () => {
      return import("ssrB/nav");
    },
    { ssr: false }
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>SSR A</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Nav />
        <p className={styles.description}>SSR App A</p>
      </main>
    </div>
  );
}
