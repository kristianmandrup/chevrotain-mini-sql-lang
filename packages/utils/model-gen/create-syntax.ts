import merge from "deepmerge";
import uniq from "array-uniq";
import { toArray } from "../syntax-gen";

export const createSyntax = model => (repoKey, opts: any = {}): any => {
  const { references, name, root } = opts;
  let syntax: any = {};
  if (name) {
    syntax.name = name;
  }

  if (references) {
    syntax.references = toArray(references);
  }
  if (root) {
    syntax.root = root;
  }

  const existingSyntax = (model[repoKey] || {}).syntax || {};
  syntax = merge(existingSyntax, syntax);
  if (syntax.references) {
    syntax.references = uniq(syntax.references);
  }

  model[repoKey] = {
    syntax
  };
  return model;
};
