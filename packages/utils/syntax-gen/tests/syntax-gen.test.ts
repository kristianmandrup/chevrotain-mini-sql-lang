import { generateSyntax } from "../syntax-gen";
const context = describe;

describe("generateSyntax", () => {
  const data = [
    {
      type: "root",
      name: "root",
      references: ["expression"]
    },
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
  context("empty opts", () => {
    it("throws", () => {
      const result = generateSyntax(data, {
        name: "sqlx",
        main: "root",
        ext: "sqlx"
      });
      expect(result).toEqual({
        name: "sqlx",
        scopeName: "source.sqlx",
        fileTypes: ["sqlx"],
        patterns: ["#root"],
        repository: {
          block: {
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
          },
          root: {
            name: "root.sqlx",
            patterns: [
              {
                include: "#expression"
              }
            ]
          }
        }
      });
    });
  });
});
