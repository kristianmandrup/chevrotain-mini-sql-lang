import { generateBlockObj } from "./gen-block";
const context = describe;

describe("generateBlockObj", () => {
  const data = [
    {
      syntax: {
        block: true,
        beginToken: "{",
        endToken: "}",
        name: "meta.brace.curly",
        references: "expression"
      }
    }
  ];
  context("block data", () => {
    it("create block object", () => {
      expect(generateBlockObj(data, { ext: "sqlx" })).toEqual({
        begin: "\\{",
        beginCaptures: {
          0: "meta.brace.curly.sqlx"
        },
        end: "\\}",
        endCaptures: {
          0: "meta.brace.curly.sqlx"
        },
        patterns: [
          {
            include: "#expression"
          }
        ]
      });
    });
  });
});
