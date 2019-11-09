# Abstract Language Server

```ts
class AbstractLanguageServer <
  T extends Parser & IStandardParser
> {
  protected readonly documents: lsp.TextDocuments;
  protected readonly parseStateManager: ParseStateManager;
```

## Initialization

The initialization phase starts in the `constructor`

```ts
  constructor(
    protected readonly connection: lsp.IConnection,
    protected readonly parser: T
  ) {
    this.documents = new lsp.TextDocuments();
    this.parseStateManager = getParseStateManager();
    this.documents.listen(connection);
    this.documents.onDidChangeContent(this.handleContentChange.bind(this));
    this.documents.onDidClose(this.handleDocumentClose.bind(this));
    this.connection.onRequest(this.handleUninitializedRequest.bind(this));
    this.connection.onInitialize(this.handleInitialization.bind(this));
  }

  start() {
    this.connection.listen();
  }

  abstract onInitialization(params: lsp.InitializeParams);

  // sets up request and hover handlers
  private handleInitialization(
    params: lsp.InitializeParams
  ): lsp.InitializeResult {
    // Setting this StarHandler is intended to overwrite the handler set
    // in the constructor, which always responded with a "Server not initialized"
    // error. Here, we're initialized, so we replace with an "Unhandled method"
    this.connection.onRequest(this.handleUnhandledRequest.bind(this));
    this.connection.onHover(this.handleHover.bind(this));
    return this.onInitialization(params);
  }
```

### onContentChange

The `handleContentChange` method handles any content change in the document.
Any change triggers  a `TextDocumentChangeEvent` which the method receives as input parameter. The event includes the `document` for which the event was triggered. From the document we retrieve the `uri`. We then call the `parseDocument` method to retreive a `parseResult` containing:

- `cst`
- `errors`
- `tokens`
- `otherParseData`

For the content changed. We then save the new `cst` and `tokens` for the document using the `parseStateManager`, calling `saveParseStateForUri` to update the internal `state` hashmap.
We then call `onContentChange` (abstract method for you to implement) with the `params` and the `parseResult` to allow for custom handling.

```ts
  abstract onContentChange(
    params: lsp.TextDocumentChangeEvent,
    parseResults: ReturnType<AbstractLanguageServer<T>["parseDocument"]>
  ): void;

private handleContentChange(params: lsp.TextDocumentChangeEvent) {
    const { document } = params;
    const { uri } = document;
    const { cst, tokens } = parseResult;
    this.parseStateManager.saveParseStateForUri(uri, { cst, tokens });
    return this.onContentChange(params, parseResult);
  }
```

Sample `onContentChange` from `BaseLanguageServer`:

We first get the `content` using `document.getText();`.

If there is NO `content` (empty) we send empty diagnostics using `this.connection.sendDiagnostics` and return.

If there IS content we retrieve Lexer and Parser diagnostics using:

- `this.getLexDiagnostics(document, tokens)`
- `this.getParseDiagnostics(document, errors)`

Then send the diagnostics as `diagnostics: [...lexDiagnostics, ...parseDiagnostics]`

```ts
  onContentChange(
    { document }: lsp.TextDocumentChangeEvent,
    parseResults: ReturnType<
      AbstractLanguageServer<LanguageServerParser>["parseDocument"]
    >
  ) {
    const { uri } = document;
    const content = document.getText();

    if (!content.length) {
      this.connection.sendDiagnostics({
        uri,
        diagnostics: []
      });
      return;
    }

    const { tokens, errors } = parseResults;
    const lexDiagnostics = this.getLexDiagnostics(document, tokens);
    const parseDiagnostics = this.getParseDiagnostics(document, errors);

    return this.connection.sendDiagnostics({
      uri,
      diagnostics: [...lexDiagnostics, ...parseDiagnostics]
    });
  }
  ```

### Hover

The `handleHover` method receives text document position parameters `TextDocumentPositionParams` in the `params` object. We first get the `uri` of the document and then fetch the `document` using
`this.documents.get(uri)` and then the `content` of the document using `document.getText()`.
We then get the cst using `this.parseStateManager.getParseStateForUri(uri)`

See the `constructor` and the `getParseStateManager` factory method in `parseState.ts` for more details on this infrastructure. If there is no matching `cst` for the `uri` a new parse state is created and saved `this.parseStateManager.saveParseStateForUri(uri, { cst })` and this state is thenused.

Internally the parse state manager manages a `state` hashmap `const state: { [uri: string]: InternalParseStateManagerStateForUri } = {};`

We then calculate the current offset position and ...

```ts
  handleHover(params: lsp.TextDocumentPositionParams): lsp.Hover {
    const { uri } = params.textDocument;
    const document: any = this.documents.get(uri);
    const content = document.getText();
    let { cst } = this.parseStateManager.getParseStateForUri(uri);

    if (!cst) {
      const { cst: newCst } = this.parseDocument(document);
      cst = newCst;
      this.parseStateManager.saveParseStateForUri(uri, { cst });
    }

    const offsetAtPosition = document.offsetAt(params.position);
    const currentRuleTokens: IToken[] = [];
    let cursorTkn: IToken | undefined;
    let currentRule: string | undefined;
```

We then traverse the `cst` using the `findCurrentRule` finder function, which updates:

- `offsetAtPosition`
- `cursorTkn`
- `currentRule`

While it traverses the cst...

If a rule match is NOT found (ie. `cursorTkn` is `undefined`), we return empty `contents` (no hover result).

If a match IS found, we return `contents` for the `currentRule` and a `range` with `start` and `end` matching document position offsets. The range is calculated using `findCurrentRuleChange(currentRuleTokens)` which reduces the list of `currentRuleTokens` to a `{startOffset, endOffset}` position range map, ie. where the tokens for the matched rule start and end.

The `currentRule` is `parentCtx.node.name` ie the name of the matching CST node.

```ts
    // ...
    traverse(cst, findCurrentRule);

    if (!cursorTkn) {
      return {
        contents: []
      };
    }

    return {
      contents: `\`\`\`
${currentRule}
\`\`\``,
      range: {
        start: document.positionAt(currentRuleRange.startOffset),
        end: document.positionAt(currentRuleRange.endOffset + 1)
      }
    };
  }
}
```

## Parse document

The `parseDocument` method takes a VSCode text `document` and uses the chevrotain `parser` to parse the `content` to return:

- `cst`
- `errors`
- `otherParseData`

We get the `tokens` from `this.parser.input`. This data is then returned.

```ts
  parseDocument(document: lsp.TextDocument) {
    const content = document.getText();
    const { cst, errors, ...otherParseData } = this.parser.parse(content);
    const tokens = this.parser.input;
    return {
      cst,
      tokens,
      errors,
      otherParseData
    }
  }
```

## Lex diagnostics

The `getLexDiagnostics` returns the lexer diagnostics, ie. token errors.
We filter the tokens for any `tokenType` which has the `tokenName` of `Unknown` (ie. unknown token)The unknown tokens are then mapped through a diagnostics function.

- `severity: Error`
- `message: "Unknown token"`
- `range: { start, end }`

The method returns an array of `lsp.Diagnostic` objects that the VSCode IDE can handle and displayed, such as in the error console (problems list).

```ts
  getLexDiagnostics(document: lsp.TextDocument, tokens: IToken[]) {
    return tokens
      .filter(res => (res.tokenType as any).tokenName === "Unknown")
      .map(
        (unknownToken: any): lsp.Diagnostic => ({
          severity: lsp.DiagnosticSeverity.Error,
          message: `Unknown token`,
          range: {
            start: document.positionAt(unknownToken.startOffset),
            // chevrotains' token sends our inclusive
            end: document.positionAt(unknownToken.endOffset + 1)
          }
        })
      );
  }
```

## Parse diagnostics

The `getParseDiagnostics` method takes the VSCode text `document` and a list of semantic `errors`.
It maps through the `errors` with a function to generate VSCode IDE compatible diagnostics (ie. `lsp.Diagnostic`).

- `range`

```ts
  getParseDiagnostics(document: lsp.TextDocument, errors: ISemanticError[]) {
    const content = document.getText();

    return errors.map(
      (error): lsp.Diagnostic => {
```

The diagnostic function first extracts `message`, `context`, and `token` from the `error`.
It then extracts the `ruleStack` from the `context`. Then the `source` as the last element of  the ruleStack.

```ts
  const { message, context, token } = error;
  const ruleStack = context ? context.ruleStack : null;
  const source =
    ruleStack && ruleStack.length > 0
      ? ruleStack[ruleStack.length - 1]
      : undefined;
```

It can now create an initial diagnostic `constructedDiagnostic` with:

- `severity: Error`
- `message`
- `source`

```ts
  const constructedDiagnostic: Partial<lsp.Diagnostic> = {
    message,
    source,
    severity: lsp.DiagnosticSeverity.Error
  };
```

The `constructedDiagnostic` is then further enriched with range information.
If the token is NOT `EOF` (end of file) we calculate the range with document positions,
using the token offset positions.

```ts
  if ((token.tokenType as any).tokenName !== "EOF") {
    constructedDiagnostic.range = lsp.Range.create(
      document.positionAt(token.startOffset),
      document.positionAt((token.endOffset || token.startOffset) + 1)
    );
```

If we are at the `EOF` we calculate `rangeStart` and `rangeEnd`.

If the `previousToken` has an `endOffset` we use the minimum of the `endOffset` of the previous token or the entire document content length as the basis. If there is no such `endOffset` for the previous token, we simply default to document content length for both start and end.

```ts
  const { previousToken = {} } = error as any; // chevrotain doesn't have this typed fully, but it exists for early exit exceptions
  let rangeStart;
  let rangeEnd;

  if (typeof previousToken.endOffset !== "undefined") {
    rangeStart = Math.min(previousToken.endOffset + 1, content.length);
    rangeEnd = Math.min(previousToken.endOffset + 2, content.length);
  } else {
    rangeStart = rangeEnd = content.length;
  }
```

We then set the range for `constructedDiagnostic` using `document.positionAt(rangeStart)` and `document.positionAt(rangeEnd)`

```ts
constructedDiagnostic.range = lsp.Range.create(
  document.positionAt(rangeStart),
  document.positionAt(rangeEnd)
);
return constructedDiagnostic as lsp.Diagnostic;
```
