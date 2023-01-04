import { useContext } from 'react';

import { Context as UserAuthContext } from 'remoteSSR/app';

function useUserAuth() {
  const { userAuth, isLoggedIn } = useContext(UserAuthContext);
  userAuth.isLoggedIn = isLoggedIn;
  return userAuth;
}

export default useUserAuth;
