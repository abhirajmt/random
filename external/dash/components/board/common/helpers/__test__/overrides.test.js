import { replaceVariablesOnSubject } from "../overrides";

describe("Testing override helpers", () => {
  describe("Testing replaceVariablesOnSubject", () => {
    it("simple variable replacement", () => {
      const subject = "{{variable1}} {{variable2}} {{variable3}}";
      const environment = {
        variable1: "value1",
        variable2: "value2",
        variable3: "value3",
      }
      const result = replaceVariablesOnSubject(subject, environment)
      expect(result).toEqual("value1 value2 value3");
    });

    it("undefined variable in string", () => {
      const subject = "{{variable1}} {{variable2}}";
      const environment = {
        variable1: "value1",
      }
      const result = replaceVariablesOnSubject(subject, environment)
      expect(result).toEqual("value1 undefined");
    });

    it("single undefined variable with skipUndefined enabled", () => {
      const subject = "{{variable1}}";
      const environment = {
      }
      const result = replaceVariablesOnSubject(subject, environment, { skipUndefined: true })
      expect(result).toEqual("{{variable1}}");
    });

    it("single undefined variable with skipUndefined disabled", () => {
      const subject = "{{variable1}}";
      const environment = {
      }
      const result = replaceVariablesOnSubject(subject, environment, { skipUndefined: false })
      expect(result).toEqual(undefined);
    });

    it("acyclic nested variable replacement", () => {
      const subject = "{{variable1}}";
      const environment = {
        variable1: "value1 {{variable2}} {{variable2}} {{variable3}}",
        variable2: "value2 {{variable3}}",
        variable3: "value3",
      };
      const result = replaceVariablesOnSubject(subject, environment)
      expect(result).toEqual("value1 value2 value3 value2 value3 value3");
    });

    // will do replacement as per dfs traversal
    it("cyclic single variable replacement", () => {
      const subject = "{{variable1}}";
      const environment = {
        variable1: "{{variable1}}",
      }
      const result = replaceVariablesOnSubject(subject, environment)
      expect(result).toEqual("{{variable1}}");
    });

    // will do replacement as per dfs traversal
    it("cyclic nested variable replacement", () => {
      const subject = "{{variable1}}";
      const environment = {
        variable1: "value1 {{variable2}} {{variable3}}",
        variable2: "value2 {{variable3}}",
        variable3: "value3 {{variable1}}",
      }
      const result = replaceVariablesOnSubject(subject, environment)
      expect(result).toEqual("value1 value2 value3 {{variable1}} value3 {{variable1}}");
    });

    it("handles null value for variable", () => {
      const subject = "{{variable1}}";
      const environment = {
        variable1: null
      }
      const result = replaceVariablesOnSubject(subject, environment)
      expect(result).toEqual(null);
    });

    it("handles null value for multiple variables", () => {
      const subject = "{{variable1}} {{variable2}}";
      const environment = {
        variable1: null,
        variable2: null,
      }
      const result = replaceVariablesOnSubject(subject, environment)
      expect(result).toEqual("null null");
    });

    it("can replace variables in JSON string", () => {
      const subject = '{"a":{"b":"{{variable1}}"},"c":"{{variable2}} {{variable3}}"}';
      const environment = {
        variable1: "value1",
        variable2: "value2",
        variable3: "value3",
      };
      const result = replaceVariablesOnSubject(subject, environment)
      const resultObject = JSON.parse(result);
      const expectedObject = { "a": { "b": "value1" }, "c": "value2 value3" };
      expect(resultObject).toEqual(expectedObject);
    });

  });
});
