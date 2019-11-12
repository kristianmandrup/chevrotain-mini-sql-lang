import { createConsume } from "./create-consume";
import { createSyntax } from "./create-syntax";

export class SyntaxModel {
  model: any = {};
  consume = createConsume(this.model);
  syntax = createSyntax(this.model);
}

export function log<T extends { new (...constructorArgs: any[]) }>(
  constructorFunction: T
) {
  //new constructor function
  let newConstructorFunction: any = function(...args) {
    console.log("before invoking: " + constructorFunction.name);
    let func: any = function() {
      return new constructorFunction(...args);
    };
    func.prototype = constructorFunction.prototype;
    let result: any = new func();
    console.log("after invoking: " + constructorFunction.name);
    console.log("object created: " + JSON.stringify(result));
    return result;
  };
  newConstructorFunction.prototype = constructorFunction.prototype;
  return newConstructorFunction;
}

export const withSyntaxModeller = clazz => {
  clazz.prototype.syntaxModel = function() {
    this._syntaxModel = this._syntaxModel || new SyntaxModel();
    return this._syntaxModel;
  };

  clazz.prototype.stxModel = function() {
    return this.syntaxModel().model;
  };

  clazz.prototype.parserOn = function() {
    this._parserDisabled = false;
  };

  clazz.prototype.parserOff = function() {
    this._parserDisabled = true;
  };

  clazz.prototype.consumeStx = function(tokenRef, opts = {}) {
    const token = this.tokenFor(tokenRef);
    if (!this._parserDisabled) {
      this.CONSUME(token);
    }
    this.syntaxModel().consume(opts);
  };

  clazz.prototype.syntax = function(repoKey, syntaxName, opts: any = {}) {
    this.syntaxModel().syntax(repoKey, syntaxName, opts);
  };

  clazz.prototype.tokenFor = function(tokenName) {
    const tokenMapEntry = this.tokenMap[tokenName];
    return tokenMapEntry
      ? tokenMapEntry.token || tokenMapEntry
      : this.error(`No such token ${tokenName}`);
  };

  return clazz;
};
