import { sparqlTokenMap } from "../standard/helpers/tokens";
import { createToken, TokenType } from "chevrotain";

export const unicodeRegexp = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;

export const turtleTokenMap = {
  Comment: createToken({
    name: "Comment",
    pattern: /#[^\n]*/,
    group: "comments"
  }),
  LBracket: sparqlTokenMap.LBracket,
  RBracket: sparqlTokenMap.RBracket,
  LParen: sparqlTokenMap.LParen,
  RParen: sparqlTokenMap.RParen,
  Period: sparqlTokenMap.Period,
  WhiteSpace: sparqlTokenMap.WhiteSpace,
  // 'true' and 'false' are case sensitive in Turtle but not in SPARQL
  TRUE: createToken({
    name: "TRUE",
    pattern: /true/
  }),

  FALSE: createToken({
    name: "FALSE",
    pattern: /false/
  })
};

export const turtleTokenTypes: TokenType[] = [
  turtleTokenMap.Comment,

  sparqlTokenMap.ANON,
  sparqlTokenMap.LBracket,
  sparqlTokenMap.RBracket,
  sparqlTokenMap.LParen,
  sparqlTokenMap.RParen,
  sparqlTokenMap.WhiteSpace,

  turtleTokenMap.TRUE,
  turtleTokenMap.FALSE,

  sparqlTokenMap.Comma,
  sparqlTokenMap.Semicolon
];
