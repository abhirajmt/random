export function isLocalAuthContext(context) {
  return context !== undefined;
}

export function createUserDataFromExternalUserInteractionId(id) {
  return {
    id: `external-${id}`,
    name: `external-${id}`,
    email: `external.${id}@mindtickle.com`,
  };
}
