import { createToken, Lexer } from "chevrotain";

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary: any = {};

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadata
const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });

// We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
// See: https://github.com/SAP/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js
const Select = createToken({
  name: "Select",
  pattern: /SELECT/,
  longer_alt: Identifier
});

const From = createToken({
  name: "From",
  pattern: /FROM/,
  longer_alt: Identifier
});
const Where = createToken({
  name: "Where",
  pattern: /WHERE/,
  longer_alt: Identifier
});

const Comma = createToken({ name: "Comma", pattern: /,/ });
const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });
const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ });
const LessThan = createToken({ name: "LessThan", pattern: /</ });
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

// The order of tokens is important
const allTokens = [
  WhiteSpace,
  // "keywords" appear before the Identifier
  Select,
  From,
  Where,
  Comma,
  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  Integer,
  GreaterThan,
  LessThan
];

export const selectLexer: any = new Lexer(allTokens);

allTokens.forEach(tokenType => {
  tokenVocabulary[tokenType.name] = tokenType;
});

export { tokenVocabulary };
