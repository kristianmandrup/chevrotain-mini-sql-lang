import merge from "deepmerge";
import uniq from "array-uniq";

export const createSyntax = model => (
  repoKey,
  syntaxName,
  opts: any = {}
): any => {
  const { references, root } = opts;
  let syntax: any = {
    name: syntaxName
  };
  if (references) {
    syntax.references = references;
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
