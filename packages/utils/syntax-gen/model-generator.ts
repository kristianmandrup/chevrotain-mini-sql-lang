export class SyntaxModel {
  model: any = {};

  consume = opts => {
    let { type, matches, partOf } = opts;
    matches = toArray(matches);
    partOf = toArray(partOf);

    const existingSyntax = (this.model[type] || {}).syntax;
    existingSyntax.matches = existingSyntax.matches || [];
    existingSyntax.partOf = existingSyntax.partOf || [];

    const typeEntry = {
      syntax: {
        matches: [...existingSyntax.matches, ...matches],
        partOf: [...existingSyntax.partOf, ...partOf]
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

  clazz.prototype.consume = function(tokenRef, opts = {}) {
    const token = this.tokenFor(tokenRef);
    this.CONSUME(token);
    this.syntaxModel.consume(tokenRef, opts);
  };

  clazz.prototype.syntax = function(repoKey, syntaxName, opts: any = {}) {
    this.syntaxModel.syntax(repoKey, syntaxName, opts);
  };

  return clazz;
};

const toArray = entry => (Array.isArray(entry) ? entry : [entry]);
