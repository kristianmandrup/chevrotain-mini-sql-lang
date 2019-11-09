# BaseLanguageServer

The `BaseLanguageServer` extends the `AbstractLanguageServer` and provides sane default implementations for:

- `onInitialization`
- `onContentChange`

The `onInitialization` returns the capabilities provided:

- `textDocumentSync` NONE text document sync mode
- `hoverProvider: true` ie. supports hover

The `onContentChange` will send no diagnotistics if there is no content.
If there is content, it will calculate Lexer and Parse diagnostics, merge these diagnostics lists into one and send the diagnostics via `this.connection.sendDiagnostics`

In most cases you can safely build your own `LanguageServer` by extending the `BaseLanguageServer`
