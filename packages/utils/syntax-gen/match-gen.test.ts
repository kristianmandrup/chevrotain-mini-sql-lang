import { generateMatchObj } from "./gen-match";
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
        name: "meta.keyword",
        matches: "when"
      }
    ];
    it("creates syntax object", () => {
      expect(generateMatchObj(data, { ext: "sqlx" })).toEqual({});
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
