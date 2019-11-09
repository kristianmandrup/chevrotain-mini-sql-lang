// @ts-ignore: import types for declarations
import { createToken, Lexer, TokenType } from "chevrotain";
import { terminals } from "./terminals";
// import { keywords } from "./keywords";

export const sparqlTokenMap = {
  IRIREF: terminals.IRIREF,
  LANGTAG: terminals.LANGTAG,
  INTEGER: terminals.INTEGER,
  DECIMAL: terminals.DECIMAL,
  DOUBLE: terminals.DOUBLE,
  INTEGER_POSITIVE: terminals.INTEGER_POSITIVE,
  DECIMAL_POSITIVE: terminals.DECIMAL_POSITIVE,
  DOUBLE_POSITIVE: terminals.DOUBLE_POSITIVE,
  INTEGER_NEGATIVE: terminals.INTEGER_NEGATIVE,
  DECIMAL_NEGATIVE: terminals.DECIMAL_NEGATIVE,
  DOUBLE_NEGATIVE: terminals.DOUBLE_NEGATIVE,
  STRING_LITERAL1: terminals.STRING_LITERAL1,
  STRING_LITERAL2: terminals.STRING_LITERAL2,
  STRING_LITERAL_LONG1: terminals.STRING_LITERAL_LONG1,
  STRING_LITERAL_LONG2: terminals.STRING_LITERAL_LONG2,
  NIL: terminals.NIL,
  ANON: terminals.ANON,
  PNAME_NS: terminals.PNAME_NS,
  PNAME_LN: terminals.PNAME_LN,
  BLANK_NODE_LABEL: terminals.BLANK_NODE_LABEL,
  VAR1: terminals.VAR1,
  VAR2: terminals.VAR2,
  PERCENT: terminals.PERCENT,

  Comment: createToken({
    name: "Comment",
    pattern: /#[^\n]*/,
    group: "comments"
  }),
  LCurly: createToken({ name: "LCurly", pattern: "{" }),
  RCurly: createToken({ name: "RCurly", pattern: "}" }),
  LParen: createToken({ name: "LParen", pattern: "(" }),
  RParen: createToken({ name: "RParen", pattern: ")" }),
  WhiteSpace: createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
    line_breaks: true
  }),

  Star: createToken({
    name: "Star",
    pattern: "*"
  }),

  Unknown: createToken({
    name: "Unknown",
    // Unknown comes _before_ `A` in the token ordering because we need it to
    // match custom/XPath functions like `atan`, etc. But we also need it to
    // _not_ capture `A` tokens. This pattern catches anything that is either
    // (1) 'a' followed by non-whitespace (up to the next non-word character) or
    // (2) not 'a' or whitespace (up to the next non-word character).
    pattern: /(?:a\S|[^a\s])\w*/i
  }),

  Period: createToken({
    name: "Period",
    pattern: "."
  }),

  QuestionMark: createToken({
    name: "QuestionMark",
    pattern: "?"
  }),

  Plus: createToken({
    name: "Plus",
    pattern: "+"
  }),

  Minus: createToken({
    name: "Minus",
    pattern: "-"
  }),

  LBracket: createToken({
    name: "LBracket",
    pattern: "["
  }),

  RBracket: createToken({
    name: "RBracket",
    pattern: "]"
  }),

  Semicolon: createToken({
    name: "Semicolon",
    pattern: ";"
  }),

  Comma: createToken({
    name: "Comma",
    pattern: ","
  }),

  Pipe: createToken({
    name: "Pipe",
    pattern: "|"
  }),

  ForwardSlash: createToken({
    name: "ForwardSlash",
    pattern: "/"
  }),

  Caret: createToken({
    name: "Caret",
    pattern: "^"
  }),

  DoubleCaret: createToken({
    name: "DoubleCaret",
    pattern: "^^"
  }),

  Bang: createToken({
    name: "Bang",
    pattern: "!"
  }),

  LogicalOr: createToken({
    name: "LogicalOr",
    pattern: "||"
  }),

  LogicalAnd: createToken({
    name: "LogicalAnd",
    pattern: "&&"
  }),

  Equals: createToken({
    name: "Equals",
    pattern: "="
  }),

  NotEquals: createToken({
    name: "NotEquals",
    pattern: "!="
  }),

  LessThan: createToken({
    name: "LessThan",
    pattern: "<"
  }),

  GreaterThan: createToken({
    name: "GreaterThan",
    pattern: ">"
  }),

  LessThanEquals: createToken({
    name: "LessThanEquals",
    pattern: "<="
  }),

  GreaterThanEquals: createToken({
    name: "GreaterThanEquals",
    pattern: ">="
  })

  // SELECT: keywords.SELECT,
  // CONSTRUCT: keywords.CONSTRUCT,
  // DISTINCT: keywords.DISTINCT
};

export const baseTokens = [
  sparqlTokenMap.NIL,
  sparqlTokenMap.ANON,
  sparqlTokenMap.LCurly,
  sparqlTokenMap.RCurly,
  sparqlTokenMap.LParen,
  sparqlTokenMap.RParen,
  sparqlTokenMap.WhiteSpace,
  sparqlTokenMap.IRIREF,
  sparqlTokenMap.LANGTAG,
  sparqlTokenMap.DOUBLE,
  sparqlTokenMap.DECIMAL,
  sparqlTokenMap.INTEGER,
  sparqlTokenMap.DOUBLE_POSITIVE,
  sparqlTokenMap.DECIMAL_POSITIVE,
  sparqlTokenMap.INTEGER_POSITIVE,
  sparqlTokenMap.DOUBLE_NEGATIVE,
  sparqlTokenMap.DECIMAL_NEGATIVE,
  sparqlTokenMap.INTEGER_NEGATIVE,
  sparqlTokenMap.STRING_LITERAL1,
  sparqlTokenMap.STRING_LITERAL2,
  sparqlTokenMap.STRING_LITERAL_LONG1,
  sparqlTokenMap.STRING_LITERAL_LONG2,
  sparqlTokenMap.PNAME_NS,
  sparqlTokenMap.PNAME_LN,
  sparqlTokenMap.BLANK_NODE_LABEL,
  sparqlTokenMap.VAR1,
  sparqlTokenMap.VAR2,
  sparqlTokenMap.Comment,

  // keywords

  sparqlTokenMap.Star,
  sparqlTokenMap.Period,
  sparqlTokenMap.QuestionMark,
  sparqlTokenMap.Plus,
  sparqlTokenMap.Minus,
  sparqlTokenMap.LBracket,
  sparqlTokenMap.RBracket,
  sparqlTokenMap.PERCENT,

  sparqlTokenMap.Semicolon,
  sparqlTokenMap.Comma,
  sparqlTokenMap.ForwardSlash,
  sparqlTokenMap.DoubleCaret,
  sparqlTokenMap.Caret,
  sparqlTokenMap.LogicalOr,
  sparqlTokenMap.Pipe,
  sparqlTokenMap.LogicalAnd,
  sparqlTokenMap.NotEquals,
  sparqlTokenMap.Bang,
  sparqlTokenMap.Equals,
  sparqlTokenMap.LessThanEquals,
  sparqlTokenMap.GreaterThanEquals,
  sparqlTokenMap.LessThan,
  sparqlTokenMap.GreaterThan,
  sparqlTokenMap.Unknown
];

export const pathsTokens = [];

export const nonStandardTokens = [...pathsTokens];
