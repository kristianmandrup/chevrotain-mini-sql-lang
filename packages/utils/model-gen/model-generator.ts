export const createConsume = (model: any) => (opts: any = {}): void => {
  let { type, matches, partOf, begin, end, block } = opts;

  const syntax: any = {};

  matches = toArray(matches);
  partOf = toArray(partOf);

  const existingSyntax = (model[type] || {}).syntax || {};

  existingSyntax.partOf = existingSyntax.partOf || [];
  existingSyntax.matches = existingSyntax.matches || [];

  if (!block) {
    existingSyntax.matches = existingSyntax.matches || [];
    matches = [...existingSyntax.matches, ...matches];
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

  partOf = [...existingSyntax.partOf, ...partOf];
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
};

export const createSyntax = model => (repoKey, syntaxName, opts: any = {}) => {
  const { references, root } = opts;
  const syntax = {
    name: syntaxName,
    references,
    root
  };
  const existingSyntax = (model[repoKey] || {}).syntax;
  model[repoKey] = {
    syntax: {
      ...existingSyntax,
      ...syntax
    }
  };
};

export class SyntaxModel {
  model: any = {};
  consume = createConsume(this.model);
  syntax = createSyntax(this.model);
}

export const withSyntaxModeller = clazz => {
  clazz.prototype.syntaxModel = function() {
    this._syntaxModel = this._syntaxModel || new SyntaxModel();
  };

  clazz.prototype.consumeStx = function(tokenRef, opts = {}) {
    const token = this.tokenFor(tokenRef);
    this.CONSUME(token);
    this.syntaxModel.consume(tokenRef, opts);
  };

  clazz.prototype.syntax = function(repoKey, syntaxName, opts: any = {}) {
    this.syntaxModel.syntax(repoKey, syntaxName, opts);
  };

  clazz.prototype.tokenFor = function(tokenName) {
    const tokenMapEntry = this.tokenMap[tokenName];
    return tokenMapEntry
      ? tokenMapEntry.token
      : this.error(`No such token ${tokenName}`);
  };

  return clazz;
};

export const toArray = entry => (Array.isArray(entry) ? entry : [entry]);
