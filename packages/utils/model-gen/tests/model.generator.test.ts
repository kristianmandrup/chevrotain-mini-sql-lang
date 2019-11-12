import { withSyntaxModeller } from "../syntax-model";
import { BaseParser } from "../../../lsp-utils";

class SqlParser extends BaseParser {
  rootRule = () => this.turtleDoc;

  turtleDoc = this.RULE("sqlDoc", () => {
    this.MANY(() => this.SUBRULE(this.statement));
  });

  statement = this.RULE("statement", () => {});
}

const context = describe;

describe("withSyntaxModeller", () => {
  const ParseWithSM = withSyntaxModeller(SqlParser);

  context("parser", () => {
    const parser = new ParseWithSM();

    describe("syntaxModel", () => {
      it("is an instance of SyntaxModel", () => {
        expect(parser.syntaxModel).toBeDefined();
      });
    });

    describe("consumeStx", () => {
      it("adds to syntax model", () => {
        const syntaxDef = {
          type: "condition",
          partOf: "expression",
          matches: "when"
        };
        parser.consumeStx("when", syntaxDef);
        const { condition } = parser.syntaxModel;
        expect(condition).toEqual({
          matches: "when"
        });
      });
    });

    describe("syntax", () => {
      it("adds to syntax model", () => {
        const repoKey = "clause";
        const syntaxName = "when";
        const opts = {
          references: ["when", "from"]
        };
        parser.syntax(repoKey, syntaxName, opts);
        const { clause } = parser.syntaxModel;
        expect(clause).toEqual({
          name: "when",
          references: ["when", "from"]
        });
      });
    });
  });
});
