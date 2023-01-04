/* eslint-disable prettier/prettier */
export const OVERRIDE_KEYS = {
  REINFORCEMENT_MODULE: 'REINFORCEMENT_MODULE',
  REINFORCMENT_CHALLENGE: 'REINFORCMENT_CHALLENGE',
  REINFORCEMENT_TAB_NAME: 'REINFORCEMENT_TAB_NAME',
};

const OVERRIDE_KEY_COMPANY_SETTINGS_KEY = {
  [OVERRIDE_KEYS.REINFORCEMENT_MODULE]: 'reinforcementModuleName',
  [OVERRIDE_KEYS.REINFORCMENT_CHALLENGE]: 'reinforcementChallengeName',
  [OVERRIDE_KEYS.REINFORCEMENT_TAB_NAME]: 'reinforcementTabName',
};

export function getOverrideLabels(companySettings) {
  return Object.keys(OVERRIDE_KEYS).reduce(function (accumulatedOverrideKeys, overrideKey) {
    const companySettingsKey = OVERRIDE_KEY_COMPANY_SETTINGS_KEY[overrideKey];

    if (companySettingsKey) {
      accumulatedOverrideKeys[overrideKey] = companySettings[companySettingsKey];
    }
    return accumulatedOverrideKeys;
  }, {});
}
