export function getAdminSideUserAuth(auth) {
  const { company = {}, user = {} } = auth;
  const { companySettings: features = {}, extra_config: tempFeatureConfig = {}, ...rest } = company;
  const authData = {
    company: {
      companyType: company.type,
      companyLogo: company.logoUrl,
      ...rest,
    },
    ...user,
    features,
    // this is for temporary small enhancement/feature releases.
    tempFeatureConfig,
  };
  return authData;
}

export function getLSUserAuth(auth) {
  const { company = {}, user = {} } = auth;
  const { features = {}, extra_config: tempFeatureConfig = {}, ...rest } = company;
  const authData = {
    company: {
      companyType: company.type,
      displayName: company.name,
      logo: company.logoUrl,
      languages: company.languages,
      ...rest,
    },
    ...user,
    features,
    tempFeatureConfig,
  };
  return authData;
}
