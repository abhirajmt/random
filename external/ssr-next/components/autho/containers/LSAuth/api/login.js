/* eslint-disable complexity, max-statements */
import get from 'node-fetch';
// import { get } from '@mindtickle/api-helpers';
// import { isEmpty } from '@mindtickle/utils';

import { Defaults, LoginType } from '../../../config/env.config';
import { SupportedSocialLogins } from '../../../config/env.config';
import { getOverrideLabels } from '../../../utils/companySettings';
import { getPermissionByRoles } from '../../../utils/roles';
import ApiUrls from '../config/api.config';
import { setALFeatureFlag } from '../../../utils';
import { ROLES_MAP } from '../config/constants';
const LoginService = {};

export const isObject = obj => typeof obj === 'object' && obj !== null
;
export const isUndefined = value => typeof value === 'undefined';

export const isFunction = fn => typeof fn === 'function';

export const isString = value => typeof value === 'string';

export const isNull = value => value === null;
export function isEmpty(x) {
  if (isObject(x) && !Object.keys(x).length) return true;
  if (Array.isArray(x) && !x.length) return true;
  if (isString(x) && !x.length) return true;
  if (isUndefined(x) || isNull(x)) return true;
  return false;
}

const parseSupportedLanguages = (languages = []) => {
  let result = {};
  languages.forEach(v => {
    result[v.code] = v.name;
  });
  return result;
};

const processCompanyData = (company = {}, allRoles = []) => {
  const roleIds = Object.keys(allRoles);
  const additionalConfig = company.extra_config || {};
  const loginMethods = parseLoginMethods(company.loginMethods, additionalConfig.loginMethodTexts);
  const supportedLanguages = parseSupportedLanguages(company.languages),
    overrideLabels = getOverrideLabels(company.lsSettings);
  const customisedData = parseCustomisedData(additionalConfig);
  // setALFeatureFlag(additionalConfig);

  const lsSettings = company.lsSettings || {};
  const { coachingSettings = {}, missionSettings = {} } = lsSettings;
  const data = {
    id: company.id,
    parentCompany: company.parent_company,
    title: company.displayName || '...',
    orgId: company.orgId,
    cdnId: company.cdnId,
    s3Dir: company.s3Dir,
    coverImage:
      company.coverImage && company.coverImage.obj
        ? company.coverImage.obj.processed_path
        : Defaults.companyBanner,
    logoUrl:
      company.logo && company.logo.obj ? company.logo.obj.processed_path : Defaults.companyLogo,
    name: company.displayName || Defaults.companyName,
    tagLine: company.tagLine || Defaults.companyTagLine,
    socialLinks: {
      fb: company.fbLink,
      gp: company.gpLink,
      tw: company.twLink,
      in: company.inLink,
      insta: company.instaLink,
    },
    type: company.companyType,
    defaultLanguage: {
      code: company.defaultLanguage,
      name: supportedLanguages[company.defaultLanguage],
    },
    languages: supportedLanguages || [],
    allowedDomains: company.allowedDomains || [],
    supportEmail: additionalConfig.supportEmail || Defaults.supportEmail,
    localeUrls: company.localeUrls,
    companySettings: {
      logoUrl: lsSettings?.learningSiteLogo?.obj?.processed_path,
      brandColor: lsSettings?.brandColor,
      showSmartInsights: lsSettings.insightsEnabled && roleIds.includes(ROLES_MAP.MANAGER),
      disableParticipants: company.disableParticipants,
      modulesUnderMaintenance: lsSettings.modulesUnderMaintenance || [],
      enabledModuleTypes: lsSettings.enabledModuleTypes || [],
      fullStoryEnabled:
        additionalConfig.fullStoryEnabled && JSON.parse(additionalConfig.fullStoryEnabled),
      isUIDEnabled: lsSettings.isUIDEnabled,
      assetHubEnabled: lsSettings.assetHubEnabled,
      callAIEnabledInLS: lsSettings.callAIEnabledInLS,
      dSREnabled: lsSettings.dSREnabled,
      enableVossCollaboration: lsSettings.enableVossCollaboration,
      userImpersonationEnabled: lsSettings.userImpersonationEnabled,
      userImpersonationSessionTimeLimit: lsSettings.userImpersonationSessionTimeLimit,
      seriesMilestonesEnabled: lsSettings.seriesMilestonesEnabled,
      hubOverviewPagesEnabled: lsSettings.hubOverviewPagesEnabled,
      managerAnalyticsEnabled: lsSettings.managerAnalyticsEnabled,
      programOverviewPagesEnabled: lsSettings.programOverviewPagesEnabled,
      programCertificationsEnabled: lsSettings.programCertificationsEnabled,
      ...coachingSettings,
      ...missionSettings,
    },
    socialLogins: loginMethods.social,
    mtLogin: loginMethods.mt,
    tempHire: loginMethods.tempHire,
    strongPassword: company.strongPassword,
    companyName: company.companyName,
    linkedInOrgId: company.linkedInOrgId,
    overrideLabels,
    ...customisedData,
    extra_config: additionalConfig,
  };

  return data;
};

const parseLoginError = data => {
  const { error } = data || {};
  let __error = null;
  if (error && !isEmpty(error)) {
    __error = {
      statusCode: parseInt(error.status),
    };
  }
  return __error;
};

const parserUserFromLogin = data => {
  const {
    user,
    learner,
    permissions,
    helpdesk_set,
    url,
    sessionId,
    delegation,
    superlogin,
    maintainence = {},
  } = data;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    learnerRoles: learner.roles,
    username: user.username,
    roles: user.roles,
    score: learner.score,
    state: learner.state,
    primaryEmail: learner.primary_email,
    locale: user.locale,
    permissions,
    redirectUrl: helpdesk_set && url,
    sessionId,
    delegation,
    superlogin,
    maintenance: {
      message: maintainence?.AS_message,
      startTime: (maintainence?.startTime || 0) * 1000,
      endTime: (maintainence?.endTime || 0) * 1000,
    },
    pic: user.pic,
    kScore: learner.kScore,
  };
};

const processLoginData = (auth = {}) => {
  const error = parseLoginError(auth);
  let user = null;
  if (!error) {
    user = parserUserFromLogin(auth);
  }
  let data = {
    error,
    user,
  };
  return data;
};

//Process cname verification and login check
const processAuthData = async (authData, host) => {
  if (authData.login && authData.login.error) {
    const { user, error } = processLoginData({
      ...authData.login,
      sessionId: authData.sessionId,
    });
    return {
      company: processCompanyData(authData.company),
      user,
      error,
    };
  }
  const { roles: { rolesData } = {} } = authData;
  const { learner: { roles = [] } = {} } = authData.login;

  const { permissions, allRoles = {} } = await getPermissionByRoles(
    host,
    roles,
    rolesData
  );
  const { user } = processLoginData({
    ...authData.login,
    permissions,
    sessionId: authData.sessionId,
    delegation: authData.delegation,
    superlogin: authData.superlogin,
  });
  return {
    company: processCompanyData(authData.company, allRoles),
    user,
  };
};

//login related util functions

export const checkSocialLoginSupported = type => {
  const details = SupportedSocialLogins[type];
  return details || false;
};

const parseLoginMethods = (methods = [], customizedText = {}) => {
  let loginTypes = {
    social: [],
    mt: false,
    tempHire: false,
  };
  for (let login of methods) {
    const loginTypeDetails = checkSocialLoginSupported(login.type);
    if (loginTypeDetails && login.isEnabled) {
      const {
        signin: customisedTextLogin = false,
        signup: customisedTextSignup = false,
        subLineHtml: customisedSubHtml = false,
      } = customizedText[login.type] || {};
      loginTypes.social.push({
        type: loginTypeDetails.name,
        isOkta: login.isOkta || false,
        textId: {
          login: loginTypeDetails.login,
          signup: loginTypeDetails.signup,
        },
        customisedText: {
          login: customisedTextLogin,
          signup: customisedTextSignup,
          subHTML: customisedSubHtml,
        },
      });
    } else if (login.type === Defaults.mtLoginType && login.isEnabled) {
      loginTypes.mt = {
        type: Defaults.mtLoginType,
        registrationEnabled: login.isRegistrationEnabled || false,
      };
    } else if (login.type === LoginType.TEMPHIRE && login.isEnabled) {
      loginTypes.tempHire = {
        type: LoginType.TEMPHIRE,
      };
    }
  }
  return loginTypes;
};

const parseCustomisedData = (data = {}) => ({
  removeLoginHeaders: data.removeLoginCommonHeader || false,
  customFeed: data.customFeed ? data.customFeed.replace(/script1/gi, 'script') : false,
});

LoginService.checkAuth = async ({ baseDomain, localeForApps, host }) => {
  try {
    const url = ApiUrls.checkAuth({
      baseDomain,
      localeForApps,
    });
    let response = await get(url?.url, { credentials: 'include' });
    response = await response.json();
    response = await processAuthData(response, host);
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
};

LoginService.logout = async () => {
  let data = await get(ApiUrls.logout());
  return data;
};

export default LoginService;
