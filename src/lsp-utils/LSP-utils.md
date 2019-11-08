# LSP utils

```ts
class AbstractLanguageServer <
  T extends Parser & IStardogParser
> {
  protected readonly documents: lsp.TextDocuments;
  protected readonly parseStateManager: ParseStateManager;
```

### Initialization

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

```ts
  abstract onContentChange(
    params: lsp.TextDocumentChangeEvent,
    parseResults: ReturnType<AbstractLanguageServer<T>["parseDocument"]>
  ): void;

private handleContentChange(params: lsp.TextDocumentChangeEvent) {
    const { document } = params;
    const { uri } = document;
    const { cst, errors, tokens, otherParseData } = this.parseDocument(
      document
    );
    this.parseStateManager.saveParseStateForUri(uri, { cst, tokens });
    return this.onContentChange(params, {
      cst,
      errors,
      tokens,
      otherParseData
    });
  }
```

### Hover

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

    // ...
  }  
}
```
