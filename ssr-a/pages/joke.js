import React from "react";
import styles from "../styles/Home.module.css";

export default function Home({ joke }) {
  return (
    <div>
      <main>
        <div>
          via server props
          <p>{joke?.value}</p>
          <p>{joke?.url}</p>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Fetch data from external API
  const res = await fetch("https://api.chucknorris.io/jokes/random");
  const joke = await res.json();

  console.log(joke);

  // Pass data to the page via props
  return { props: { joke } };
}
