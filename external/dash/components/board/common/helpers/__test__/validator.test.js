import { validate } from "~/common/helpers";

describe("Testing Validators", () => {
  describe("Testing callback Validator", () => {
    it("must be an object", () => {
      expect(() => validate.callbacks(3)).toThrow();
      expect(() => validate.callbacks(NaN)).toThrow();
      expect(() => validate.callbacks("abcd")).toThrow();
      expect(() => validate.callbacks([])).toThrow();
      expect(() => validate.callbacks(Symbol())).toThrow();
      expect(() => validate.callbacks(function() {})).toThrow();
      expect(() => validate.callbacks(() => {})).toThrow();
      expect(() => validate.callbacks({})).not.toThrow();
      expect(() => validate.callbacks(null)).not.toThrow();
      expect(() => validate.callbacks(undefined)).not.toThrow();
      expect(() => validate.callbacks()).not.toThrow();
    });

    it("callbacks fields must be function", () => {
      expect(() => validate.callbacks({ onClick: 3 })).toThrow();
      expect(() => validate.callbacks({ onClick: NaN })).toThrow();
      expect(() => validate.callbacks({ onClick: Symbol() })).toThrow();
      expect(() => validate.callbacks({ onClick: [] })).toThrow();
      expect(() => validate.callbacks({ onClick: {} })).toThrow();
      expect(() => validate.callbacks({ onClick: 1n })).toThrow();
      expect(() => validate.callbacks({ onClick: "avd" })).toThrow();
      expect(() => validate.callbacks({ onClick: null })).not.toThrow();
      expect(() => validate.callbacks({ onClick: undefined })).not.toThrow();
      expect(() =>
        validate.callbacks({
          onClick: () => {},
        })
      ).not.toThrow();
      expect(() =>
        validate.callbacks({
          onClick: function() {},
        })
      ).not.toThrow();
    });
  });
});
