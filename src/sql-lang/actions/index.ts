import assert from "assert";
import { toAst as toAstVisitor } from "./actions-visitor";
import { toAst as toAstEmbedded } from "./actions-embedded";

let inputText = "SELECT column1, column2 FROM table2 WHERE column2 > 3";

let astFromVisitor = toAstVisitor(inputText);
let astFromEmbedded = toAstEmbedded(inputText);

console.log(JSON.stringify(astFromVisitor, null, "\t"));

assert.deepEqual(
  astFromVisitor,
  astFromEmbedded,
  "Both ASTs should be identical"
);
