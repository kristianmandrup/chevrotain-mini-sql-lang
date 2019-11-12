import { generateRefObj } from "./gen-ref";
const context = describe;

describe("generateRefObj", () => {
  const data = [
    {
      name: "root",
      references: ["expression"]
    }
  ];
  context("empty list", () => {
    it("empty obj", () => {
      expect(generateRefObj(data, { ext: "sqlx" })).toEqual({
        name: "root.sqlx",
        patterns: [
          {
            include: "#expression"
          }
        ]
      });
    });
  });
});
