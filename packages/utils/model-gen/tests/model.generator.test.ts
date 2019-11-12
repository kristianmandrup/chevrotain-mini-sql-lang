import { withSyntaxModeller } from "../syntax-model";
import { BaseParser } from "../../../lsp-utils";
import { createToken } from "chevrotain";

class SqlParser extends BaseParser {
  rootRule = () => this.turtleDoc();

  turtleDoc = () =>
    this.RULE("sqlDoc", () => {
      this.MANY(() => this.SUBRULE(this.statement()));
    });

  statement = () => this.RULE("statement", () => {});
}

const context = describe;

describe("withSyntaxModeller", () => {
  const ParseWithSM = withSyntaxModeller(SqlParser);

  context("parser", () => {
    const config = {};
    const whenToken = createToken({
      name: "when",
      label: "when",
      pattern: /When/
    });

    const tokenTypes = [whenToken];
    const performSelfAnalysis = true;
    const parser = new ParseWithSM(
      config,
      tokenTypes,
      tokenTypes,
      performSelfAnalysis
    );
    parser.tokenMap = {
      when: whenToken
    };

    ParseWithSM.performSelfAnalysis(parser);

    describe("syntaxModel", () => {
      it("is an instance of SyntaxModel", () => {
        expect(parser.syntaxModel()).toBeDefined();
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
        const model = parser.syntaxModel();
        console.log("consume", { model });
        const { condition } = model;
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
        const model = parser.syntaxModel();
        console.log("syntax", { model });
        const { clause } = model;
        expect(clause).toEqual({
          name: "when",
          references: ["when", "from"]
        });
      });
    });
  });
});
