import { generateRepo } from "./repo-gen";
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
        type: "",
        block: true,
        beginToken: "{",
        endToken: "}",
        name: "meta.brace.curly",
        references: "expression"
      }
    }
  ];
  context("empty opts", () => {
    it("throws", () => {
      expect(generateRepo(data, { name: "sqlx", ext: "sqlx" })).toEqual({
        name: "sqlx",
        scopeName: "source.sqlx",
        repository: {
          root: {
            name: "root.sqlx",
            patterns: [
              {
                name: "root.sqlx",
                include: "#expression"
              }
            ]
          }
        }
      });
    });
  });
});
