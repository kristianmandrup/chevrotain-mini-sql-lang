// @ts-ignore: import types for declarations
import { createToken } from "chevrotain";

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

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
