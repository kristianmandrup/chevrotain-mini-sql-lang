# Chevrotain SQL parser in TypeScript

The [Chevrotatain mini SQL parser tutorial](https://sap.github.io/chevrotain/docs/tutorial) converted to [TypeScript](https://www.typescriptlang.org/) and [Jest](jestjs.io)

Also includes a nested scope language example in `src/scope-lang`

- [Original Chevrotain example code](https://github.com/SAP/chevrotain/tree/master/examples/tutorial)

The following `packages` ae included:

- `utils` utility functions etc for writing lexer/parser infrastructure
- `lsp-util` utility functions etc for LSP and related infra
- `base-language-server` class `BaseLanguageServer` for chevrotain based LSP
- `turtle` sample Turtle parser example using namespaces (scopes)

## Install

`$ npm install`

## Run tests

This project uses [Jest](jestjs.io) with [jest-extended](https://github.com/jest-community/jest-extended) for additional convenience expectations

`$ npx jest`

## Design

- lexer
- parser
- actions and AST
- error handling and recovery

### Lexer

```ts
let inputText = "SELECT column1 FROM table2";
let lexingResult = lex(inputText);
const { tokens } = lexingResult;
```

### Parser

```ts
const inputText = "SELECT column1 FROM table2";
const result = parse(inputText);
```

Invalid input

```ts
let inputText = "SELECT FROM table2";
parse(inputText); // throws
```

### Actions

#### AST

Given an input of: `SELECT column1, column2 FROM table2 WHERE column2 > 3`

The `AST` generated for both embedded and visitor actions looks like this:

```ts
  {
  type: 'SELECT_STMT',
  selectClause: { type: 'SELECT_CLAUSE', columns: [ 'column1', 'column2' ] },
  fromClause: { type: 'FROM_CLAUSE', table: 'table2' },
  whereClause: {
    type: 'WHERE_CLAUSE',
    condition: { type: 'EXPRESSION', lhs: 'column2', operator: '>', rhs: '3' }
  }
}
```

Using this information, we could f.ex generate T-SQL statements to create database tables to match the columns referenced in the query:

```ts
const dotProp = require('dot-prop')

const typeNameMap = {
  'SELECT_STMT': 'select',

}

const createDbTable = (tableName) => `CREATE TABLE ${tableName};`

const handleFrom = (clause) => clause.table.map(createDbTable)

const handlerTree = {
  select: {
    fromClause(node) => handleFrom(node)
  }
}

const stmtHandlers = {
  select(node) => {
    const keys = Objec.keys(node)
    keys.reduce((acc, key) => {
      const childNode = node[key]
      if (!childNode) return acc
      const { type } = childNode
      const typePath = [node.typePath, type].join('.')
      const handler = dotProp(handlerTree, typePath)
      if (!handler) return acc
      childNode.typePath = typePath
      const result = handler(childNode)
      acc.push(result)
      return acc
    }, [])
  }
}

const handleNode = (node) => {
  const stmtType = typeNameMap[node.type]
  if (!stmtType) return
  return stmtHandlers[stmtType](node)
}

const distinct = (values) => [...new Set(values)]

distinct(AST.map(handleNode))
```

This would return an array: `["CREATE TABLE table2"]`

```ts
const createColumn = (columnName) => columnName

const handleSelect = (clause) => ({columnInstructions: clause.columns.map(createColumn)})
const handleFrom = (clause) => ({tableInstruction: clause.table.map(createDbTable) })

const handlerTree = {
  select: {
    fromClause(node) => handleFrom(node)
    selectClause(node) => handleSelect(node)
  }
}
```

We should then also modify the reduce to operate on a hashmap (object), merging the result of each handler

```ts
      acc = {
        ...acc,
        ...result
      }
      return acc
    }, {})
```

The result would then be something like:

```ts
[
  {
    tableInstruction: "CREATE TABLE table2",
    columnInstructions: ["column1", "column2"]
  }
];
```

Which we could then use to generate something like:

```ts
CREATE TABLE table2 {
  column1,
  column2
}
```

This is a rather contrived example however where we don't have enough information from the query itself to determine the types of the columns to be created for the T-SQL statements. See [SQL create table](https://www.w3schools.com/sql/sql_create_table.asp)

### Error recovery

See the `error-recovery.spec.ts` tests.

Invalid extra token `}` before colon `:`

```ts
let invalidInput = '{ "key" }: 696}';
let parsingResult = parseJsonToCst(invalidInput);
// perform error recovery - create minimal valid cst (add or remove tokens as needed)
let minimizedCst = minimizeCst(parsingResult.cst);
```

Invalid number `696` after `2`

```ts
// the '696' number literal should not appear after the "2"
let invalidInput =
  '{\n"key1" : 1, \n"key2" : 2 696 \n"key3"  : 3, \n"key4"  : 4 }';
```

## Nested Scope example

The nested scope language example can be found in `src/scope-lang`.

It is intended as an example for how to work with nested scopes and provide content assist over LSP for an editor/IDE such as VS Code.

## Content Assist

- [chevrotain content assist example project](https://github.com/SAP/chevrotain/tree/master/examples/parser/content_assist) with specs.

- [Chevrotain Editor/LSP discussion](https://github.com/SAP/chevrotain/issues/921#issuecomment-555581552)

From [language-server-dot-visual-studio](https://tomassetti.me/language-server-dot-visual-studio/)

[Quick Start to VSCode Plug-Ins: Code Completion](https://medium.com/dataseries/quick-start-to-vscode-plug-ins-code-completion-408b95f5b5a6)

To add the completion provider (aka "content assist) for a VSC extension

```js
connection.onInitialize((params): InitializeResult => {
  return {
    capabilities: {
      // ...
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ["="]
      },
      hoverProvider: true
    }
  };
});
```

Sample `onCompletion` handler:

```ts
connection.onCompletion((textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
  let text = documents.get(textDocumentPosition.textDocument.uri).getText();
  let position = textDocumentPosition.position;
  const lines = text.split(/\r?\n/g);
  const currentLine = lines[position.line]

  // use parsed model to lookup via position
  // return a list of auto complete suggestions (for = assignment)
  return results;
```

```ts
const assignmentIndex = {
  3: { varsAvailable: ["a"] },
  9: { varsAvailable: ["a, b"] },
  17: { varsAvailable: ["b", "c"] }
};
```

```ts
const toAst = (inputText: string, opts = {}) => {
  const lexResult = lex(inputText);

  const toAstVisitorInstance: any = new AstVisitor(opts);

  // ".input" is a setter which will reset the parser's internal's state.
  parserInstance.input = lexResult.tokens;

  // Automatic CST created when parsing
  const cst = parserInstance.statements();

  if (parserInstance.errors.length > 0) {
    throw Error(
      "Sad sad panda, parsing errors detected!\n" +
        parserInstance.errors[0].message
    );
  }
  const ast = toAstVisitorInstance.visit(cst);
  // console.log("AST - visitor", ast);
  return ast;
}

const onChange = (textDocumentPosition: TextDocumentPositionParams) => {
    let text = documents.get(textDocumentPosition.textDocument.uri).getText();
    const scopeTree = toAstVisitor(text, { positioned: true });

    // run scope builder
    const builder = new ScopeStackBuilder();
    builder.build(scopeTree);
    const { lineMap } = builder;
    // we should
    this.find = {
      assignment = createIndexMatcher(lineMap, "assignment");
    }
  };
};

const onCompletion = (textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
  // position has character and line position
  let position = textDocumentPosition.position;
  const lines = text.split(/\r?\n/g);
  // determine char just before position
  const pos = {
    line: position.line,
    column: position.character
  };
  // return a list of auto complete suggestions (for = assignment)
  const node = this.find.assignment(pos);
  const varsWithinScope = node.varsAvailable;
  let completionItems = new Array<CompletionItem>();
  varsWithinScope.map(varName => results.push({
    label: varName,
    kind: CompletionItemKind.Reference,
    data: varName
  }))
  return completionItems;
};
```

See [CompletionItemKind](https://docs.microsoft.com/en-us/dotnet/api/microsoft.visualstudio.languageserver.protocol.completionitemkind?view=visualstudiosdk-2019) enum (and more VS Code API documentation)

To find a match, a primitive approach would be to simply iterate through this list until it finds first one with position greater than current document position (or at end of list) then use the one before that.

## VS Code Language extension

See [VSC Language extension](./VSC-lang-extension.md)

### Editor/IDE utils

[chevrotain-editor-utils](https://github.com/kristianmandrup/chevrotain-editor-utils)

### Language Server utils

[chevrotain-lsp-utils](https://github.com/kristianmandrup/chevrotain-lsp-utils)
