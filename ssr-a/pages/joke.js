import React from "react";

export default function Joke(props) {
  const { joke } = props;
  console.log(props);

  return (
    <div>
      <main>
        <h2>joke page</h2>
        <div>
          <p>value - {joke?.value}</p>
          <p>url - {joke?.url}</p>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch("https://api.chucknorris.io/jokes/random");
  const joke = await res.json();

  // Pass data to the page via props
  return { props: { joke } };
}
