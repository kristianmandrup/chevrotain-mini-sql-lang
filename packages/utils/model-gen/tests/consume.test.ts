import { createConsume } from "../create-consume";

const context = describe;

describe("consume via createConsume", () => {
  let model: any = {};
  let consume;

  beforeEach(() => {
    model = {};
    consume = createConsume(model);
  });

  context("match", () => {
    const syntaxDef = {
      type: "when-condition",
      partOf: "expression",
      matches: "when"
    };
    it("works", () => {
      consume(syntaxDef);
      const expressionDef = model.expression;
      // console.log({ blockSyntax, expressionDef });
      expect(expressionDef).toEqual({
        references: ["when-condition"]
      });
      const whenSyntax = model["when-condition"].syntax;
      expect(whenSyntax).toEqual({
        matches: ["when"]
        // partOf: ["expression"]
      });
    });
  });

  context("block", () => {
    const syntaxDef = {
      type: "block",
      partOf: "expression",
      begin: "curly",
      matches: "{",
      block: true
    };

    it("works", () => {
      consume(syntaxDef);
      const blockSyntax = model.block.syntax;
      const expressionDef = model.expression;
      // console.log({ blockSyntax, expressionDef });
      expect(expressionDef).toEqual({
        references: ["block"]
      });
      expect(blockSyntax).toEqual({
        beginToken: {
          matches: "{",
          name: "curly"
        },
        // partOf: ["expression"],
        block: true
      });
    });
  });
});
