import { generateRepo } from "../repo-gen";
const context = describe;

describe("generateRepo", () => {
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
  context("valid args and opts", () => {
    it("throws", () => {
      const repo = generateRepo(data, { name: "sqlx", ext: "sqlx" });
      expect(repo).toEqual({
        root: {
          name: "root.sqlx",
          patterns: [
            {
              include: "#expression"
            }
          ]
        },
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
        }
      });
    });
  });
});
