import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import("remoteCSR/Nav"), {
  ssr: false,
});

export default () => {
  return (
    <>
      <Dashboard />
      Pass correct shell context for the app to work
    </>
  );
};
