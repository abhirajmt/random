import dynamic from 'next/dynamic';

const ReactRemoteComponentCSR = dynamic(() => import("dashboard/app"), {
  ssr: false,
});

export default () => {
  return (
    <>
      <ReactRemoteComponentCSR />
      I am SSR but not the component above
    </>
  );
};

// import SSRPage from 'dashboard/app';
// const SSR = SSRPage;
// SSR.getInitialProps = SSRPage.getInitialProps;
// export default SSR;
