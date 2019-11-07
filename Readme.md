# Chevrotain SQL parser in TypeScript

The [Chevrotatain SQL parser tutorial](https://sap.github.io/chevrotain/docs/tutorial) converted to [TypeScript](https://www.typescriptlang.org/) and [Jest](jestjs.io)

- [Original Chevrotain example code](https://github.com/SAP/chevrotain/tree/master/examples/tutorial)

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
