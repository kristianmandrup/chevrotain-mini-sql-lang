import { createSyntax } from "../model-generator";

describe("consume via createSyntax", () => {
  const model = {};
  const syntax = createSyntax(model);
  it("enriches parser", () => {
    const repoKey = "when-condition";
    const syntaxName = "when";
    const opts = {};
    syntax(repoKey, syntaxName, opts);
    expect(model[repoKey]).toEqual({
      [syntaxName]: true
    });
  });
});
