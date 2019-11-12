import { GenerateRepoOpts } from "./types";
import { warn } from "./util";
import { generateRepo } from "./repo-gen";

export const generateSyntax = (data, opts: GenerateRepoOpts) => {
  let { fileTypes, name, main, scopeName } = opts;

  if (!fileTypes) {
    warn(`missing fileTypes, using ["${name}"]`);
  }
  main = main || "expression";
  fileTypes = fileTypes || [name];
  scopeName = scopeName || `source.${name}`;
  const repository = generateRepo(data, opts);
  return {
    name,
    fileTypes,
    patterns: [`#${main}`],
    scopeName,
    repository
  };
};

export const generateSyntaxJson = (data, opts: GenerateRepoOpts) => {
  const syntaxModel = generateSyntax(data, opts);
  return JSON.stringify(syntaxModel, null, 2);
};
