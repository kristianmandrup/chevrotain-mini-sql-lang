import { generateMatchObj } from "../match-gen";
const context = describe;

describe("generateMatchObj", () => {
  const data = [];
  context("empty list", () => {
    it("empty obj", () => {
      expect(generateMatchObj(data, { ext: "sqlx" })).toEqual({});
    });
  });

  context.only("valid item", () => {
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
        match: "when",
        name: "meta.keyword.sqlx"
      });
    });
  });

  context("valid syntax item", () => {
    const data = [
      {
        syntax: {
          name: "meta.keyword",
          matches: "when"
        }
      }
    ];
    it("creates syntax object", () => {
      expect(generateMatchObj(data, { ext: "sqlx" })).toEqual({
        name: "meta.keyword.sqlx",
        match: "\\s*(?i)" + "(when)" + "\\b"
      });
    });
  });
});
