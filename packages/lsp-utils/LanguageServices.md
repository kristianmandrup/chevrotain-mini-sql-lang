# Language services

Utils and helper functions

## regexPatternToString

Converts a Regex pattern into a string. Used by `getTokenDisplayName` in `errorMessageProvider`

## makeFilterUniqueTokensByType

TODO

## Filters

### isVar

Test if token is a variable of some sort. By default testing if `tokenName` is `VAR1` or `VAR2`

### isPrefix

Test if prefix for namespaced name, ie. if `tokenName` is `PNAME_NS`

### isLocalName

Test if reference is a local name, ie. if `tokenName` is `PNAME_LN`

## getUniqueIdentifiers

Get all unique identifiers, by filtering all tokens by the above filters, returning map:

```ts
  vars: makeFilterUniqueTokensByType(isVar)(tokens),
  prefixes: makeFilterUniqueTokensByType(isPrefix)(tokens),
  localNames: makeFilterUniqueTokensByType(isLocalName)(tokens),
```

## getTokenTypesForCategory

Filter all tokens by matching categories

`getTokenTypesForCategory(categoryName: string, allTokens: TokenType[])`
