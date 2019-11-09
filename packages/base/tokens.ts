import { tokenMap } from "../standard";
import { createToken, TokenType } from "chevrotain";

export const unicodeRegexp = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;

const {
  ANON,
  LBracket,
  RBracket,
  LParen,
  RParen,
  Period,
  WhiteSpace,
  Comma,
  Semicolon
} = tokenMap;

export const $tokenMap = {
  Comment: createToken({
    name: "Comment",
    pattern: /#[^\n]*/,
    group: "comments"
  }),
  LBracket,
  RBracket,
  LParen,
  RParen,
  Period,
  WhiteSpace,
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

const { Comment, TRUE, FALSE } = $tokenMap;

export const tokenTypes: TokenType[] = [
  Comment,
  ANON,
  LBracket,
  RBracket,
  LParen,
  RParen,
  WhiteSpace,

  TRUE,
  FALSE,

  Comma,
  Semicolon
];
