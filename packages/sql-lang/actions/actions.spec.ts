import * as _ from "lodash";
import { toAst as toAstVisitor } from "./actions-visitor";
import { toAst as toAstEmbedded } from "./actions-embedded";

const context = describe;

describe("Chevrotain Tutorial", () => {
  context("Step 3a - Actions (semantics) using CST Visitor", () => {
    it("Can convert a simple input to an AST", () => {
      const inputText = "SELECT column1, column2 FROM table2 WHERE column2 > 3";
      const ast = toAstVisitor(inputText);

      expect(ast).toEqual({
        type: "SELECT_STMT",
        selectClause: {
          type: "SELECT_CLAUSE",
          columns: ["column1", "column2"]
        },
        fromClause: {
          type: "FROM_CLAUSE",
          table: "table2"
        },
        whereClause: {
          condition: {
            lhs: "column2",
            operator: ">",
            rhs: "3",
            type: "EXPRESSION"
          },
          type: "WHERE_CLAUSE"
        }
      });
    });
  });

  context("Step 3a - Actions (semantics) using embedded actions", () => {
    it("Can convert a simple input to an AST", () => {
      const inputText = "SELECT column1, column2 FROM table2 WHERE column2 > 3";
      const ast = toAstEmbedded(inputText);

      expect(ast).toEqual({
        type: "SELECT_STMT",
        selectClause: {
          type: "SELECT_CLAUSE",
          columns: ["column1", "column2"]
        },
        fromClause: {
          type: "FROM_CLAUSE",
          table: "table2"
        },
        whereClause: {
          condition: {
            lhs: "column2",
            operator: ">",
            rhs: "3",
            type: "EXPRESSION"
          },
          type: "WHERE_CLAUSE"
        }
      });
    });
  });
});
