# Standard

## CST

- `traverse`
- `unsafeTraverse`
- `isCstNode`

```ts
traverse(
  root: CstElement,
  visit: Parameters
) => void
```

```ts
unsafeTraverse(
  root: CstElement,
  visit: Parameters
)
```

`isCstNode`

```ts
isCstNode(object: CstElement) =>CstNode
```

`TraverseContext`

```ts
class TraverseContext {
  public node: CstElement;
  public parentCtx: TraverseContext;
}
```

## Keywords

Takes a list of keywords and generates a map of chevrotain lexer tokens.

`createKeywordTokenList(keywords: string[]) => {[key: string]: IToken}`

## Matchers

Simple

- `CATCH_ALL`
- `CATCH_ALL_AT_LEAST_ONE`
- `LANGTAG` such as `@az-B`
- `INTEGER`
- `DECIMAL`
- `EXPONENT`
- `WS` white space
- `HEX`
- `PN_CHARS_BASE` character base name such as `abx` (namespace, identifier etc)
- `PN_CHARS_U` PN chars with underscore allowed
- `PN_CHARS` characters?
- `PN_LOCAL` local varname

Complex

- `PERCENT`
- `VARNAME`
- `DOUBLE`
- `STRING_LITERAL1` any string with `'` wrappers, such as `'hello'`
- `STRING_LITERAL2` any string with `"` wrappers, such as `"hi"`
- `STRING_LITERAL_LONG1` any long string (spanning multiple lines) with `'''` wrappers
- `STRING_LITERAL_LONG2` any long string (spanning multiple lines) with `"""` wrappers
- `INTEGER_POSITIVE`
- `DECIMAL_POSITIVE`
- `DOUBLE_POSITIVE`
- `INTEGER_NEGATIVE`
- `DECIMAL_NEGATIVE`
- `DOUBLE_NEGATIVE`
- `VAR1` optional var such as `?xvb`
- `VAR2` special var such as `$fbh`
- `PNAME_NS` namespace name such as `xb:abc`

## Regular Expression

Helpers to make it easy to build complext regular expressions.

- `regex.or`
- `regex.and`
- `regex.option`
- `regex.many`

## Terminals

- `NIL` `()`
- `ANON` `[]`

## Tokens

- `LParen` token `(`
- `RParen` token `)`
- `RCurly` token `}`
- `LCurly` token `{`
- `Comment` line content after `#`
- `WhiteSpace`
- `TRUE`
- `FALSE`
- `Period` token `.`
- `QuestionMark` token `?`
- `Plus` token `+`
- `Minus` token `-`
- `LBracket` token `[`
- `RBracket` token `]`
- `Semicolon` token `;`
- `Comma` token `,`
- `Pipe` token `|`
- `ForwardSlash` token `/`
- `Caret` token `^`
- `DoubleCaret` token `^^`
- `Bang` token `!`
- `LogicalOr` token `||`
- `LogicalAnd` token `&&`
- `Equals` token `=`
- `NotEquals` token `!=`
- `LessThan` token `<`
- `GreaterThan` token `>`
- `LessThanEquals` token `<=`
- `GreaterThanEquals` token `>=`
- ...

## Token types

List of tokens in precendence order (ie. order of evaulation by lexer)

## Types

`IStandardParser` is a standard interface for all parsers:

- `parse(document: string) => { errors: IRecognitionException[]; cst: CstNode }`
- `tokenize(document: string) => IToken[];`

```ts
interface IStandardParser {
  tokenize: (document: string) => IToken[];
  parse: (
    document: string
  ) => { errors: IRecognitionException[]; cst: CstNode };
```

`ITokensMap` consist of a list of `IToken` for a given string key.

```ts
export interface ITokensMap {
  [key: string]: IToken[];
}
```

`ISemanticError` used to flag semantic errors in the parser. Includes:

- `resyncedTokens` a list of `IToken`
- `context` of `IRecognizerContext`

```ts
export interface ISemanticError
  extends Pick<
    IRecognitionException,
    Exclude<keyof IRecognitionException, "resyncedTokens" | "context">
  > {
  resyncedTokens?: IToken[];
  context?: IRecognizerContext;
}
```

Literal type

`type Lit = string | number | boolean | undefined | null | void | symbol | {};`

Not sure... you tell me ;)

`export const getAsTypedTuple = <T extends Lit[]>(...args: T): T => args;`
