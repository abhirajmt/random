import useSWR from "swr";

const fetcher = async () => {
  const response = await fetch("https://api.chucknorris.io/jokes/random");
  const result = await response.json();
  return result;
};

// fetched at server
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch("https://api.chucknorris.io/jokes/random");
  const data = await res.json();

  // Pass data to the page via props
  return { props: { joke: data.value } };
}

export default function Other({ joke }) {
  // fetched on client
  const { data = { value: joke }, error } = useSWR(
    "https://api.chucknorris.io/jokes/random",
    fetcher
  );

  console.log(data);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return <div>hello {data.value}!</div>;
}
