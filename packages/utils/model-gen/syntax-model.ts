import { createConsume } from "./create-consume";
import { createSyntax } from "./create-syntax";

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
