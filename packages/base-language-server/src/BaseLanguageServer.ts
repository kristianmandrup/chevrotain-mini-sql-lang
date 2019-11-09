import * as lsp from "vscode-languageserver";
import {
  errorMessageProvider,
  AbstractLanguageServer,
  LanguageServerParser
} from "../../lsp-utils";
import { TurtleParser } from "../../turtle";
import { IStardogParser } from "../../standard/helpers/types";

export class BaseLanguageServer extends AbstractLanguageServer<
  LanguageServerParser
> {
  constructor(connection: lsp.IConnection, parser: LanguageServerParser) {
    super(connection, parser);
  }

  onInitialization(_params: lsp.InitializeParams): lsp.InitializeResult {
    return {
      capabilities: {
        // Tell the client that the server works in NONE text document sync mode
        textDocumentSync: this.documents.syncKind[0],
        hoverProvider: true
      }
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
