import { generateRefObj } from "../ref-gen";
const context = describe;

describe("generateRefObj", () => {
  const data = [
    {
      type: "root",
      name: "root",
      references: ["expression"]
    }
  ];
  context("empty list", () => {
    it("empty obj", () => {
      const result = generateRefObj(data, { ext: "sqlx" });
      expect(result["root"]).toEqual({
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
