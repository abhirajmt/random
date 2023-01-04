export const learnerAuthMapper = (
  userAuth,
  { externalUserInteractionId }
) => {
  let user = {
    id: userAuth.id,
    name: userAuth.name,
    sessionId: userAuth.sessionId,
    isWebView: userAuth.isWebView,
    email: userAuth.email,
    locale: userAuth.locale,
    isLoggedIn: userAuth.isLoggedIn,
  };

  let featureToggles = {
    isFullstoryEnabled: getBoolean(userAuth.tempFeatureConfig?.fullStoryEnabled),
    isFreshchatEnabled: false,
    isZipyEnabled: userAuth.tempFeatureConfig?.zipyEnabled || false,
    isDatadogDisabled: userAuth.tempFeatureConfig?.disableDD || false,
  };

  let company = {
    id: userAuth.company.id,
    name: userAuth.company.name,
    learningSite: userAuth.company.url,
    logo: userAuth.company.logoUrl,
    isCustomer: userAuth.company.type === 'CUSTOMER',
    brandColor: userAuth.company.companySettings?.brandColor,
    localeUrls: userAuth.company.localeUrls || {},
  };

  if (externalUserInteractionId && !user.id) {
    const externalUser = {};
    user = { ...user, ...externalUser };
  }

  return {
    user,
    featureToggles,
    company,
  };
};

function getBoolean(value) {
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  }
  return !!value;
}
