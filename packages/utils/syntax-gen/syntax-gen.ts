import { escapeRegExp } from "../regex";

export const createPatternRefs = list =>
  list.reduce((acc, refName) => {
    acc.push({
      pattern: `#${refName}`
    });
    return acc;
  }, []);

export interface GenerateRepoOpts {
  ext: string;
}

export const createOrMatchesPattern = list => {
  const orStr = list.join("|");
  const strPattern = "\\s*(?i)" + orStr + "\\b";
  const regExp = escapeRegExp(strPattern);
  return new RegExp(regExp);
};

export const generateRepo = (data, opts: GenerateRepoOpts) => {
  const { ext } = opts;
  if (!ext) throw "Missing ext in options";

  const keys = Object.keys(data);
  return keys.reduce((acc, key) => {
    const obj = data[key];
    if (obj.references) {
      acc[key] = createPatternRefs(obj.references);
      return acc;
    }
    if (obj.syntax) {
      const { name, matches } = obj.syntax;
      const match = Array.isArray(matches)
        ? createOrMatchesPattern(matches)
        : matches;
      const entry = {
        name: `${name}.${ext}`,
        match
      };
      acc[key] = entry;
    }
    return acc;
  }, {});
};

export interface GenerateSyntaxOpts extends GenerateRepoOpts {
  name: string;
  fileTypes?: string[];
  scopeName?: string;
  main?: string;
}

const warn = (msg: string, data?: any) => {
  data ? console.warn(msg, data) : console.warn(msg);
};

export const generateSyntax = (data, opts: GenerateSyntaxOpts) => {
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

export const generateSyntaxJson = (data, opts: GenerateSyntaxOpts) => {
  const syntaxModel = generateSyntax(data, opts);
  return JSON.stringify(syntaxModel, null, 2);
};
