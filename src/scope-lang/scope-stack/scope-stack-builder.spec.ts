import * as _ from "lodash";
import { ScopeStackBuilder, displayJson } from "./scope-stack-builder";
import { scopeTree } from "./scope-tree";
const context = describe;

const builder = new ScopeStackBuilder();

describe("Scope stack ", () => {
  it("Creates a scope stack", () => {
    const scopedAst = builder.build(scopeTree);
    const { statements } = scopedAst;
    console.log(displayJson(statements));
    const stm1 = statements[0];
    // console.log({ stm1 });
    expect(stm1.varsAvailable).toEqual(["b"]);

    const stm2 = statements[1];
    // console.log("stm2", displayJson(stm2));
    const nested1 = stm2.statements[0];
    // console.log("nested1", displayJson(nested1));
    expect(nested1.varsAvailable).toEqual(["b", "c"]);

    const stm3 = statements[2];
    // console.log("stm3", displayJson(stm3));
    const nested2 = stm3.statements[0];
    expect(nested2.varsAvailable).toEqual(["b", "d"]);
  });
});
