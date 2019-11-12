import { generateBlockObj } from "../block-gen";
const context = describe;

describe("generateBlockObj", () => {
  const data = [
    {
      syntax: {
        type: "block",
        block: true,
        beginToken: {
          name: "meta.brace.curly",
          matches: "{"
        },
        endToken: {
          name: "meta.brace.curly",
          matches: "}"
        },
        name: "block",
        references: "expression"
      }
    }
  ];
  context("block data", () => {
    it("create block object", () => {
      const result = generateBlockObj(data, { ext: "sqlx" });
      expect(result["block"]).toEqual({
        name: "block.sqlx",
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
