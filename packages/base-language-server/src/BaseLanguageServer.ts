import * as lsp from "vscode-languageserver";
import { AbstractLanguageServer, LanguageServerParser } from "../../lsp-utils";
import { TurtleParser } from "../../turtle";

export class BaseLanguageServer extends AbstractLanguageServer<
  LanguageServerParser
> {
  constructor(connection: lsp.IConnection, parser: LanguageServerParser) {
    super(connection, parser);
  }

  get capabilities() {
    return {
      // Tell the client that the server works in NONE text document sync mode
      textDocumentSync: this.documents.syncKind[0],
      hoverProvider: true
    };
  }

  onInitialization(_params: lsp.InitializeParams): lsp.InitializeResult {
    return {
      capabilities: this.capabilities
    };
  }

  onContentChange(
    { document }: lsp.TextDocumentChangeEvent,
    parseResults: ReturnType<
      AbstractLanguageServer<TurtleParser>["parseDocument"]
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
}
