import { escapeRegExp } from "../regex";

export const createPatternRefs = (list: any[]) =>
  (list || []).reduce((acc, refName) => {
    acc.push({
      pattern: `#${refName}`
    });
    return acc;
  }, []);

export interface GenerateRepoOpts {
  ext: string;
}

const regexpFor = strPattern => new RegExp(escapeRegExp(strPattern));

export const createOrMatchesPattern = (list: string[], _) => {
  if (list.length === 0) {
    throw Error("createOrMatchesPattern: missing matches option");
  }
  const orStr = list.join("|");
  const strPattern = "\\s*(?i)" + orStr + "\\b";
  return regexpFor(strPattern);
};

export const generateRepo = (data, opts: GenerateRepoOpts) => {
  const { ext } = opts;
  if (!ext) throw "Missing ext in options";

  const refData = data.filter(item => item.references);
  const syntaxData = data.filter(item => item.syntax);
  const blockData = data.filter(item => item.block);

  const syntaxObj = Object.keys(syntaxData).reduce((acc, key) => {
    const obj = data[key];
    const { name, matches } = obj.syntax;
    const match = Array.isArray(matches)
      ? createOrMatchesPattern(matches, obj.syntax)
      : matches;
    const entry = {
      name: `${name}.${ext}`,
      match
    };
    acc[key] = entry;
    return acc;
  }, {});

  // "begin": "\\{",
  // "beginCaptures": {
  //     "0": {
  //         "name": "meta.brace.curly.sqf"
  //     }
  // },
  // "end": "\\}",
  // "endCaptures": {
  //     "0": {
  //         "name": "meta.brace.curly.sqf"
  //     }
  // },
  // $.consumeStx('LBrace', {...ctx, matches: '{', begin: 'meta.brace.curly'});
  // $.subruleStx('expression', {...ctx, matches: 'expression'});
  // $.consumeStx('RBrace', {...ctx, matches: '}', end: 'meta.brace.curly'})

  const blockObj = Object.keys(blockData).reduce((acc, key) => {
    const obj = data[key];
    const { beginToken, endToken, name, references } = obj.syntax;
    const patterns = createPatternRefs(references);
    acc[key] = {
      begin: regexpFor(beginToken.matches),
      beginCaptures: {
        "0": beginToken.name
      },
      end: regexpFor(endToken.matches),
      endCaptures: {
        "0": endToken.name
      },
      name,
      patterns
    };
    return acc;
  }, {});

  const refObj = Object.keys(refData).reduce((acc, key) => {
    const obj = data[key];
    acc[key] = createPatternRefs(obj.references);
    return acc;
  }, {});

  return {
    ...syntaxObj,
    ...blockObj,
    ...refObj
  };
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
