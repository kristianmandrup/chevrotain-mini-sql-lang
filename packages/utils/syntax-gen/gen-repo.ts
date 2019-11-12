import { GenerateRepoOpts } from "./types";
import { generateMatchObj } from "./gen-match";
import { generateBlockObj } from "./gen-block";
import { generateRefObj } from "./gen-ref";
import { error, warn } from "./util";

export const generateRepo = (data, opts: GenerateRepoOpts) => {
  const { ext } = opts;
  if (!ext) error("Missing ext in options");

  const refData = data.filter(item => item.references);
  const syntaxData = data.filter(item => item.syntax);
  const blockData = data.filter(item => item.block);

  const syntaxObj = generateMatchObj(syntaxData, opts);
  const blockObj = generateBlockObj(blockData, opts);
  const refObj = generateRefObj(refData, opts);

  return {
    ...syntaxObj,
    ...blockObj,
    ...refObj
  };
};

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
