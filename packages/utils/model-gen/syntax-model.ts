import { createConsume } from "./create-consume";
import { createSyntax } from "./create-syntax";

export class SyntaxModel {
  model: any = {};
  consume = createConsume(this.model);
  syntax = createSyntax(this.model);
}

// decorator
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

  clazz.prototype.consumeStx = function(tokenRefName, opts = {}) {
    if (!this._parserDisabled) {
      const token = this.tokenFor(tokenRefName);
      this.CONSUME(token);
    }
    this.syntaxModel().consume(opts);
  };

  clazz.prototype.subruleStx = function(ruleRefName, opts = {}) {
    if (!this._parserDisabled) {
      const rule = this.ruleFor(ruleRefName);
      // add ruleRef to
      this.SUBRULE(rule, opts);
    }
    const repoKey = opts.type;
    opts.references = opts.matches;
    this.syntaxModel().syntax(repoKey, opts);
  };

  clazz.prototype.subruleStx2 = function(ruleRefName, opts = {}) {
    if (!this._parserDisabled) {
      const rule = this.ruleFor(ruleRefName);
      this.SUBRULE2(rule, opts);
    }
    const repoKey = opts.type;
    opts.references = opts.matches;
    this.syntaxModel().syntax(repoKey, opts);
  };

  clazz.prototype.syntax = function(repoKey, opts: any = {}) {
    this.syntaxModel().syntax(repoKey, opts);
  };

  clazz.prototype.tokenFor = function(tokenName) {
    const tokenMapEntry = this.tokenMap[tokenName];
    return tokenMapEntry
      ? tokenMapEntry.token || tokenMapEntry
      : this.error(`No such token ${tokenName}`);
  };

  clazz.prototype.error =
    clazz.prototype.error ||
    function(msg: string, data?: any) {
      data ? console.error(msg) : console.error(msg, data);
      throw new Error(msg);
    };

  return clazz;
};
