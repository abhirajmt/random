const mockTracker = {
  ejectContext() {
  },
  injectContext() {
  },
  boundTrackers() {
  },
  trackStructuredEvent() {
  },
  getPlatformContexts() {
    return {
      module: {
        schemaOwner: "platform",
      },
    };
  },
};

export default mockTracker;