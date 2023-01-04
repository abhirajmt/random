import { useUserAuth } from "ssrshell/Auth";

export default function useRendererConfig(externalsKey) {
  const {
    sessionId = 'lHJzbgQlfi2VTwERTk21LpQtaDTTJPw0',
    company: { id: companyId, orgId },
    id,
  } = useUserAuth();

  return {
    useConfigParser: true,
    locale: 'en',
    appName: process.env.APPLICATION,
    tracker: children => <>{children}</>,
    // lazyLoadConfig: {
    //   useLazyLoad: true,
    // },
    [externalsKey]: {
      "x-token": sessionId,
      company_id: companyId,
      org_id: orgId,
      user_id: id,
      TRACK: process.env.TRACK,
      COMPANY_HOST: 'incubation.sc.mindtickle.local/',
    },
  };
}
