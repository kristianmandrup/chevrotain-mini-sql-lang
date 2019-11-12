import { createSyntax } from "../create-syntax";

describe("syntax via createSyntax", () => {
  let model: any = {};
  let syntax;

  beforeEach(() => {
    model = {};
    syntax = createSyntax(model);
  });

  it("creates syntax", () => {
    const repoKey = "when-condition";
    const syntaxName = "when";
    const opts = {};
    syntax(repoKey, syntaxName, opts);
    expect(model[repoKey].syntax).toEqual({
      name: "when"
      // references: []
    });
  });

  it("populates existing syntax with extra reference", () => {
    model["clause"] = {
      syntax: {
        references: ["select", "from"]
      }
    };
    const repoKey = "clause";
    const syntaxName = "when";
    const opts = {
      references: ["when", "from"]
    };
    syntax(repoKey, syntaxName, opts);
    expect(model[repoKey].syntax).toEqual({
      name: "when",
      references: ["select", "from", "when"]
    });
  });
});
