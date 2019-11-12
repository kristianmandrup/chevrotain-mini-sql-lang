import { escapeRegExp } from "../regex";

export class SyntaxModel {
  model: any = {};

  consume = opts => {
    let { type, matches, partOf, begin, end, block } = opts;
    matches = toArray(matches);
    partOf = toArray(partOf);

    const existingSyntax = (this.model[type] || {}).syntax;
    existingSyntax.matches = existingSyntax.matches || [];
    existingSyntax.partOf = existingSyntax.partOf || [];

    if (partOf) {
      const partOfObj = (this.model[partOf] = this.model[partOf] || {});
      partOfObj.references = partOfObj.references || [];
      partOfObj.references.push(type);
      this.model[partOf] = partOfObj;
    }
    let beginToken, endToken;

    const syntax: any = {};

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

    matches = [...existingSyntax.matches, ...matches];
    partOf = [...existingSyntax.partOf, ...partOf];
    if (beginToken) {
      syntax.beginToken = beginToken;
    }
    if (endToken) {
      syntax.endToken = endToken;
    }
    const typeEntry = {
      syntax: {
        matches,
        partOf
      }
    };
    this.model[type] = typeEntry;
  };

  syntax = (repoKey, syntaxName, opts: any = {}) => {
    const { references, root } = opts;
    const syntax = {
      name: syntaxName,
      references,
      root
    };
    const existingSyntax = (this.model[repoKey] || {}).syntax;
    this.model[repoKey] = {
      syntax: {
        ...existingSyntax,
        ...syntax
      }
    };
  };
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
