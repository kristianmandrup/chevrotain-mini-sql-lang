// @ts-ignore: import types for declarations
import { createToken } from "chevrotain";

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
