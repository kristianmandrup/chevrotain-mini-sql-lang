# Turtle Parser

## Adding identifiers to namespace

For the `prefixID` rule, we add the an identifier to the `namespacesMap`

```ts
  prefixID = this.RULE("prefixID", () => {
    const pnameNsToken = this.CONSUME(turtleTokenMap.PNAME_NS);
    const iriToken = this.CONSUME(turtleTokenMap.IRIREF);
    const pnameImageWithoutColon = pnameNsToken.image.slice(0, -1);
    const iriImage = iriToken.image;
    this.namespacesMap[pnameImageWithoutColon] = iriImage;

    this.CONSUME(turtleTokenMap.Period);
  });
```

## Referencing identifiers in namespace

For the `PrefixedName` we get the `prefixedNameToken` and use it to calculate the `pnameNsImage` which we look up in the `namespacesMap`. If not present we push a semantic error.

```ts
    this.semanticErrors.push({
      name: "NoNamespacePrefixError",
      message: "A prefix was used for which there was no namespace defined.",
      token: prefixedNameToken,
      // ...
    })
```

The `PrefixedName` rule:

```ts
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
```
