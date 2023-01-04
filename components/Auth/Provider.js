import './prototypesExtensions';

import { lazy, useMemo, Suspense } from 'react';

export const DynamicApps = Object.values([{}]).map(
  ({ appName }) => appName
);

export const MicroApps = [];


//@ts-ignore
import UserAuthProvider from 'remoteSSR/app';
const LocalAuthProvider = lazy(() => import(/* webpackMode: "eager" */ './LocalAuthProvider'));

function Provider({
  children,
  appName,
  ...rest
}) {
  const baseDomain = '';
  const localeForApps = useMemo(() => {
    if (appName && !MicroApps.includes(appName)) {
      return [...MicroApps, appName];
    }
    return [...MicroApps, ...DynamicApps];
  }, [appName]);

  return (
    <Suspense fallback={null}>
      <UserAuthProvider
        isOld={true}
        baseDomain={baseDomain}
        localeForApps={localeForApps}
        loader={null}
        {...rest}
      >
        <LocalAuthProvider>{children}</LocalAuthProvider>
      </UserAuthProvider>
    </Suspense>
  );
}
export default Provider;
