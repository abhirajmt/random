import { useMemo, createContext } from 'react';

import useUserAuth from './hooks/useUserAuth';

import { learnerAuthMapper } from './helpers/mapper';

const LocalAuthContext = createContext(undefined);

function LocalAuthProvider({ children }) {
  const auth = useUserAuth();

  const value = useMemo(
    () => learnerAuthMapper(auth, { externalUserInteractionId: undefined }),
    [auth]
  );
  return <LocalAuthContext.Provider value={value}>{children}</LocalAuthContext.Provider>;
}

export { LocalAuthContext };
export default LocalAuthProvider;
