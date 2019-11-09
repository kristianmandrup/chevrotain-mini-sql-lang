// @ts-ignore: import types for declarations
import { createToken } from "chevrotain";

// TODO: create keywords generator using list of keywords
export const createKeywords = (keywords: string[]): any => {
  // TODO: reduce keywords
  return {};
};

export const keywords = {
  SELECT: createToken({
    name: "SELECT",
    pattern: /SELECT/i
  }),

  CONSTRUCT: createToken({
    name: "CONSTRUCT",
    pattern: /CONSTRUCT/i
  }),

  DISTINCT: createToken({
    name: "DISTINCT",
    pattern: /DISTINCT/i
  })
};
