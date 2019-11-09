# Chevrotain SQL parser in TypeScript

The [Chevrotatain SQL parser tutorial](https://sap.github.io/chevrotain/docs/tutorial) converted to [TypeScript](https://www.typescriptlang.org/) and [Jest](jestjs.io)

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
const { tokens } = lexingResult
```

### Parser

```ts
const inputText = "SELECT column1 FROM table2"
const result = parse(inputText)
```

Invalid input

```ts
let inputText = "SELECT FROM table2";
parse(inputText) // throws
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
[{
  tableInstruction: "CREATE TABLE table2",
  columnInstructions: [
    "column1",
    "column2"
  ]
}]
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

### Basic utilities

[Utils](./packages/utils/Utils.md)

## Turtle lang example

### Working with parser namespaces

[Turtle Parser](packages/turtle/TurtleParser.md)

## VS Code Language extension

See [VSC Language extension](./VSC-lang-extension.md)

### LSP Documentation

[LSP utils](./packages/lsp-utils/LSP-utils.md)

### Base Language Server

[Base Language Server](./packages/base-language-server/src/BaseLanguageServer.md)
