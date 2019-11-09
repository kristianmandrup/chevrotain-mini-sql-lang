import { BaseParser } from "../lsp-utils";

const turtleTokenMap: any = {
  PNAME_NS: "y",
  IRIREF: "x",
  Period: "."
};

export class TurtleParser extends BaseParser {
  rootRule = () => this.turtleDoc;

  turtleDoc = this.RULE("turtleDoc", () => {
    this.MANY(() => this.SUBRULE(this.statement));
  });

  statement = this.RULE("statement", () => {});

  prefixID = this.RULE("prefixID", () => {
    const pnameNsToken = this.CONSUME(turtleTokenMap.PNAME_NS);
    const iriToken = this.CONSUME(turtleTokenMap.IRIREF);
    const pnameImageWithoutColon = pnameNsToken.image.slice(0, -1);
    const iriImage = iriToken.image;
    this.namespacesMap[pnameImageWithoutColon] = iriImage;

    this.CONSUME(turtleTokenMap.Period);
  });

  PrefixedName = this.RULE("PrefixedName", () => {
    const prefixedNameToken = this.OR([
      { ALT: () => this.CONSUME(turtleTokenMap.PNAME_LN) },
      { ALT: () => this.CONSUME(turtleTokenMap.PNAME_NS) }
    ]);
    const pnameNsImage = prefixedNameToken.image.slice(
      0,
      prefixedNameToken.image.indexOf(":")
    );
    if (!(pnameNsImage in this.namespacesMap)) {
      this.semanticErrors.push({
        name: "NoNamespacePrefixError",
        message: "A prefix was used for which there was no namespace defined.",
        token: prefixedNameToken,
        context: {
          ruleStack: (<any>this).getHumanReadableRuleStack(),
          ruleOccurrenceStack: [...(<any>this).RULE_OCCURRENCE_STACK]
        },
        resyncedTokens: [] // these don't really make sense for semantic errors, since they don't cause the parser to resync
      });
    }
  });
}
