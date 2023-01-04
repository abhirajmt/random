export const isValidTracker = tracker => {
  const requiredFunctions = [
    "getPlatformContexts",
    "injectContext",
    "boundTrackers",
    "trackStructuredEvent",
    "ejectContext",
  ];
  if (!tracker) return false;
  return requiredFunctions.every(fn => {
    return !!tracker[fn];
  });
};
