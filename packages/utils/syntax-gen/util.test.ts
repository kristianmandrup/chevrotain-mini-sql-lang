import { createOrMatchesPattern } from "./util";
const context = describe;

describe("createOrMatchesPattern", () => {
  context("empty list", () => {
    it("throws", () => {
      expect(createOrMatchesPattern([], { name: "block" })).toThrow();
    });
  });
});
