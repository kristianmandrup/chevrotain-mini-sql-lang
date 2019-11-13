import uniq from "array-uniq";
import { toArray } from "../syntax-gen";

export const createConsume = (model: any) => (opts: any = {}): any => {
  if (!model) {
    throw new Error("Invalid model");
  }
  let { type, matches, partOf, begin, end, block } = opts;

  const syntax: any = {};

  matches = toArray(matches);

  const modelEntry = model[type];
  const existingSyntax = modelEntry ? modelEntry.syntax : {};

  if (!block) {
    existingSyntax.matches = existingSyntax.matches || [];
    matches = uniq([...existingSyntax.matches, ...matches]);
    syntax.matches = matches;
  }

  partOf = toArray(partOf);
  if (partOf) {
    const partOfObj = (model[partOf] = model[partOf] || {});
    partOfObj.references = partOfObj.references || [];
    partOfObj.references.push(type);
    model[partOf] = partOfObj;
  }

  let beginToken, endToken;

  if (block) {
    syntax.block = true;
    if (begin) {
      beginToken = {
        matches: matches[0],
        name: begin
      };
    }
    if (end) {
      endToken = {
        matches: matches[0],
        name: end
      };
    }
  }

  if (beginToken) {
    syntax.beginToken = beginToken;
  }
  if (endToken) {
    syntax.endToken = endToken;
  }

  const typeEntry = {
    syntax: {
      ...existingSyntax,
      ...syntax
    }
  };
  model[type] = typeEntry;
  return model;
};
