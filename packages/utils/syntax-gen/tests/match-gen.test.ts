import { generateMatchObj } from "../match-gen";
const context = describe;

describe("generateMatchObj", () => {
  const data = [];

  context("empty list", () => {
    it("empty obj", () => {
      expect(generateMatchObj(data, { ext: "sqlx" })).toEqual({});
    });
  });

  context("valid item", () => {
    const data = [
      {
        type: "when",
        name: "meta.keyword",
        matches: "when"
      }
    ];
    it("creates syntax object", () => {
      const result = generateMatchObj(data, { ext: "sqlx" });
      expect(result["when"]).toEqual({
        match: "\\s*(?i)when\\b",
        name: "meta.keyword.sqlx"
      });
    });
  });

  context("valid syntax item", () => {
    const data = [
      {
        syntax: {
          type: "condition",
          name: "meta.keyword",
          matches: "when"
        }
      }
    ];
    it("creates syntax object", () => {
      const matchObj = generateMatchObj(data, { ext: "sqlx" });
      expect(matchObj.condition).toEqual({
        name: "meta.keyword.sqlx",
        match: "\\s*(?i)" + "when" + "\\b"
      });
    });
  });

  context("valid syntax item", () => {
    const data = [
      {
        syntax: {
          type: "condition",
          name: "meta.keyword",
          matches: ["if", "when"]
        }
      }
    ];
    it("creates syntax object", () => {
      const matchObj = generateMatchObj(data, { ext: "sqlx" });
      expect(matchObj.condition).toEqual({
        name: "meta.keyword.sqlx",
        match: "\\s*(?i)" + "(if|when)" + "\\b"
      });
    });
  });
});
