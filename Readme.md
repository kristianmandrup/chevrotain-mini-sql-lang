# Chevrotain SQL parser in TypeScript

The [Chevrotatain SQL parser tutorial](https://sap.github.io/chevrotain/docs/tutorial) converted to TypeScript and Jest

- [Original Chevrotain example code](https://github.com/SAP/chevrotain/tree/master/examples/tutorial)

## Install

`$ npm install`

## Run tests

`$ npx jest`

## Design

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
