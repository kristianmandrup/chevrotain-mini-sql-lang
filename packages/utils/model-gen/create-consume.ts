import uniq from "array-uniq";

export const createConsume = (model: any) => (opts: any = {}): any => {
  let { type, matches, partOf, begin, end, block } = opts;

  const syntax: any = {};

  matches = toArray(matches);
  partOf = toArray(partOf);

  const existingSyntax = (model[type] || {}).syntax || {};

  existingSyntax.partOf = existingSyntax.partOf || [];
  existingSyntax.matches = existingSyntax.matches || [];

  if (!block) {
    existingSyntax.matches = existingSyntax.matches || [];
    matches = uniq([...existingSyntax.matches, ...matches]);
    syntax.matches = matches;
  }

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
        matches,
        name: begin
      };
    }
    if (end) {
      endToken = {
        matches,
        name: end
      };
    }
  }

  partOf = uniq([...existingSyntax.partOf, ...partOf]);
  if (beginToken) {
    syntax.beginToken = beginToken;
  }
  if (endToken) {
    syntax.endToken = endToken;
  }

  const typeEntry = {
    syntax
  };
  model[type] = typeEntry;
  return model;
};

export const toArray = entry => (Array.isArray(entry) ? entry : [entry]);
