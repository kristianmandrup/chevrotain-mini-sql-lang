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
        expect(parser.stxModel()).toBeDefined();
      });
    });

    describe("consumeStx", () => {
      it("adds to syntax model", () => {
        const syntaxDef = {
          type: "condition",
          partOf: "expression",
          matches: "when"
        };
        parser.parserOff();
        parser.consumeStx("when", syntaxDef);
        const model = parser.stxModel();
        const { condition } = model;
        expect(condition.syntax).toEqual({
          matches: ["when"]
        });
      });
    });

    describe("syntax", () => {
      it("adds to syntax model", () => {
        const repoKey = "clause";
        const name = "when";
        const opts = {
          name,
          references: ["when", "from"]
        };
        parser.parserOff();
        parser.syntax(repoKey, opts);
        const model = parser.stxModel();
        const { clause } = model;
        expect(clause.syntax).toEqual({
          name: "when",
          references: ["when", "from"]
        });
      });
    });

    describe("subruleStx", () => {
      it("adds to syntax model", () => {
        parser.parserOff();
        const $ = parser;
        const ctx = { type: "scope-block", block: true };
        const stxName = "meta.brace.curly";
        $.consumeStx("LBrace", { ...ctx, matches: "{", begin: stxName });
        $.subruleStx("expression", { ...ctx, matches: "expression" });
        $.consumeStx("RBrace", { ...ctx, matches: "}", end: stxName });

        const model = parser.stxModel();
        const syntax = model["scope-block"].syntax;

        // console.log(syntax);

        expect(syntax).toEqual({
          block: true,
          beginToken: {
            matches: "{",
            name: stxName
          },
          endToken: {
            matches: "}",
            name: stxName
          },
          references: ["expression"]
        });
      });
    });
  });
});
