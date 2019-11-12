// @ts-ignore: import types for declarations
import { createToken } from "chevrotain";

const tokenFor = keyword =>
  createToken({
    name: keyword,
    pattern: new RegExp(keyword, "i")
  });

// create keywords token map for list of keywords
export const createKeywordTokenList = (keywords: string[]): any => {
  return keywords.reduce((acc: any, keyword: string) => {
    acc[keyword] = tokenFor(keyword);
    return acc;
  }, {});
};

export const keywords = createKeywordTokenList(["WHEN", "SELECT"]);
