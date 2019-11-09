import { $tokenMap, tokenTypes } from "../base";
import { TokenType } from "chevrotain";

export const unicodeRegexp = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;

export const turtleTokenMap = {
  ...$tokenMap
};

export const turtleTokenTypes: TokenType[] = [...tokenTypes];
