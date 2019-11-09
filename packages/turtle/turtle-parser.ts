import { BaseParser } from "../lsp-utils/BaseParser";

export class TurtleParser extends BaseParser {
  rootRule = () => this.turtleDoc;

  turtleDoc = this.RULE("turtleDoc", () => {
    this.MANY(() => this.SUBRULE(this.statement));
  });

  statement = this.RULE("statement", () => {});
}
