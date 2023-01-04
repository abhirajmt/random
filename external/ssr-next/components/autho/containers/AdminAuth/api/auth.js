/* eslint-disable prettier/prettier, complexity */
import get from 'node-fetch';

import { Defaults } from '../../../config/env.config';
import { getOverrideLabels } from '../../../utils/companySettings';
import { getPermissionByRoles } from '../../../utils/roles';
import { setALFeatureFlag } from '../../../utils';

import ApiUrls from '../config/api.config';

const AuthService = {};

const processAuthData = async (response = {}) => {
  const {
      user = {},
      orgId,
      companyId,
      cdnId,
      learner: { primary_email, roles = [], learner_uid, profile } = {},
      roles: { permissions: rolePermissions = {}, rolesData } = {},
      maintainence = {},
      default_settings: {
        assetHubEnabled,
        moduleTaggingEnabled: taggingEnabled,
        profileFieldsToDisplayInOrder,
        ruleAutomationEnabled,
        automationLinkingEnabled,
        automationSuiteEnabled,
        modulesUnderMaintenance = [],
        enabledModuleTypes,
        programCategoriesEnabled,
        seriesMilestonesEnabled,
        newRuleAutomationEnabled,
        userDirectorySwitchingEnabled,
        adminAllowedToResetPassword,
        seriesCollaborators,
        groupCollaborators,
        newUserProfileAndGroupPageUIEnabled,
        enableAdminsForInsights = [], //eslint-disable-line
        smartTranscriptionEnabled,
        insightsEnabled,
        moduleRelevanceEnabled,
        defaultModuleRelevance,
        announcementEnabled,
        sequentialUnlockingFeatureEnabled,
        seqLockingInPublicSeries,
        adminSeriesSort,
        ecommerceEnabledModuleTypes,
        enableReviewerPriority,
        contentCenterEnabled,
        emailLogsEnabled,
        auditLogsEnabled,
        isDashboardBuilderEnabled,
        programTemplatesEnabled,
        programCertificationsEnabled,
        isUIDEnabled,
        userImpersonationEnabled,
        userImpersonationSessionTimeLimit,
        maxNumOfUsersForDemo,
        scopedPublicSeries,
        clubMails,
        coachingSettings = {},
        missionSettings = {},
        pageManagementEnabled,
        programOverviewPagesEnabled,
        hubOverviewPagesEnabled,
        dSREnabled
      } = {},
      default_settings = {},
      isReviewer,
      isReviewerOnly,
      companyType,
      companyLogo,
      superlogin,
      localeUrls,
      isExcludedInMixpanel: disableTracking,
      lsCount,
      lsLink: learningSiteLink,
      lsName: learningSiteName,
      fullStoryEnabledAS: fullStoryEnabled,
      //intercom_id
      freshchat_id,
      freshchatRestoreId,
      newDashboard,
      allowOwnerToSwitchDashboardView = false,
      isReinforcementEnabledForUser,
      sessionId,
      companySwitchedToNewUM,
      extra_config,
      delegation,
      allowedDomains,
    } = response,
    overrideLabels = getOverrideLabels(default_settings);
  const isSiteOwner = roles.includes(Defaults.siteOwnerRole);
  const { permissions, allRoles } = await getPermissionByRoles(learningSiteLink, roles, rolesData),
    showSmartInsights = insightsEnabled && isSiteOwner;

  const __user = {
    name: user.name,
    state: user.state,
    email: user.email || `${learner_uid}@mt-test.com`, // deprecated, do not use this field
    primaryEmail: primary_email || '',
    username: user.username,
    id: user.id,
    locale: user.locale,
    addedOn: user.added_on,
    image: user.pic,
    permissions,
    roles: roles,
    allRoles,
    isSiteOwner,
    sessionId,
    maintenance: {
      message: maintainence && maintainence.AS_message,
      startTime: ((maintainence && maintainence.startTime) || 0) * 1000,
      endTime: ((maintainence && maintainence.endTime) || 0) * 1000,
    },
    freshchat: {
      freshchatRestoreId,
      freshchatId: freshchat_id,
    },
    taggingEnabled,
    disableTracking,
    isReviewer,
    isReviewerOnly,
    superlogin,
    timestamp: user.state && user.state.timestamp,
    moreLearningSites: lsCount > 1,
    profileFields: profile,
    overrideLabels,
    delegation,
  };

  const assetHubPermissions = [
    'SHARE_HUB_ACCESS',
    'HUB_MANAGEMENT',
    'ATTRIBUTE_MANAGEMENT',
    'DEVELOP_ASSETS',
    'APPLY_ATTRIBUTES',
  ];
  const isAssetHubEnabled =
    assetHubEnabled &&
    assetHubPermissions.some(
      permission =>
        rolePermissions[permission] === 'ALLOW' || rolePermissions[permission] === 'OVERRIDE'
    );

  setALFeatureFlag(extra_config);

  const company = {
    url: learningSiteLink,
    name: learningSiteName,
    id: companyId,
    cdnId,
    profileFieldsToDisplayInOrder,
    type: companyType,
    logoUrl: companyLogo,
    orgId,
    newDashboard,
    localeUrls: localeUrls || {},
    allowOwnerToSwitchDashboardView,
    maxNumberOfUsersAllowed: companyType === 'DEMO' ? maxNumOfUsersForDemo : -1,
    companySettings: {
      isAssetHubEnabled,
      smartTranscriptionEnabled,
      insightsEnabled,
      ruleAutomationEnabled,
      automationLinkingEnabled,
      automationSuiteEnabled,
      taggingEnabled,
      newRuleAutomationEnabled,
      userDirectorySwitchingEnabled,
      newUserProfileAndGroupPageUIEnabled,
      adminAllowedToResetPassword,
      enabledModuleTypes,
      programCategories: !!programCategoriesEnabled,
      showSmartInsights,
      seriesCollaborators,
      groupCollaborators,
      moduleRelevanceEnabled,
      defaultModuleRelevance,
      milestonesEnabled: !!seriesMilestonesEnabled,
      fullStoryEnabled,
      modulesUnderMaintenance: modulesUnderMaintenance || [],
      reinforcementEnabled: isReinforcementEnabledForUser,
      announcementEnabled,
      adminSeriesSort,
      sequentialLockEnabled: sequentialUnlockingFeatureEnabled,
      sequentialLockEnabledForPublicSeries: seqLockingInPublicSeries,
      ecommerceEnabledModuleTypes: ecommerceEnabledModuleTypes || [],
      enableReviewerPriority,
      contentCenterEnabled,
      assetHubEnabled,
      emailLogsEnabled,
      auditLogsEnabled,
      isDashboardBuilderEnabled,
      companySwitchedToNewUM,
      programTemplatesEnabled,
      programCertificationsEnabled,
      isUIDEnabled,
      userImpersonationEnabled,
      userImpersonationSessionTimeLimit,
      scopedPublicSeries,
      canChangeClubReminderMail: clubMails,
      ...coachingSettings,
      ...missionSettings,
      pageManagementEnabled,
      programOverviewPagesEnabled,
      hubOverviewPagesEnabled,
      dSREnabled
    },
    extra_config,
    allowedDomains,
  };
  return {
    user: __user,
    company,
  };
};

AuthService.auth = async ({ baseDomain, localeForApps }) => {
  try {
    let response = await get(
      ApiUrls.checkAuth({
        baseDomain,
        localeForApps,
      }),
      { credentials: 'include' }
    );
    response = await response.json();
    response = await processAuthData(response);
    return response;
  } catch (error) {
    throw error;
  }
};

AuthService.logout = async () => {
  try {
    await get(ApiUrls.logout());
  } catch (error) {
    throw error;
  }
};

export default AuthService;
