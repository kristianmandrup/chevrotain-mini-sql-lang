import { displayJson } from "../util";

export class ScopeStackBuilder {
  symbolStack: any[] = [];

  get typeHandlerMap() {
    return {
      SCOPE: "scope",
      ASSIGNMENT: "assignment"
    };
  }

  build(ast) {
    return this.evaluate(ast, null);
  }

  handlerFor(name: string) {
    return this.typeHandlerMap[name];
  }

  handle(stm: any) {
    const { type } = stm;
    const handlerName = this.handlerFor(type);
    if (!handlerName) {
      throw `Invalid type ${type}`;
    }
    const fn = this[handlerName];
    if (!fn) {
      throw `No such method ${handlerName}`;
    }
    const boundFn = fn.bind(this);
    return boundFn(stm);
  }

  get stackIndex() {
    return Math.max(0, this.symbolStack.length - 1);
  }

  get currentStackScope() {
    return this.symbolStack[this.stackIndex];
  }

  displaySymbolStack(variableName) {
    console.log(variableName, displayJson(this.symbolStack));
  }

  evaluate(statements: any[], ctx: any) {
    if (!statements) {
      // console.warn("no statements", displayJson(ctx));
      return;
    }
    return statements.map(stm => {
      const result = this.handle(stm);
      // console.log("handled stm", result);
      return {
        type: "STATEMENT",
        ...result
      };
    });
  }

  scope(ctx: any) {
    this.symbolStack.push({
      vars: []
    });

    const statements = this.evaluate(ctx.statements, ctx);
    this.symbolStack.pop();

    const node = ctx;
    if (statements) {
      node.statements = statements;
    }
    return node;
  }

  assignment(ctx: any) {
    const { variableName } = ctx;
    console.log("assignment =", ctx);
    const { currentStackScope, stackIndex, symbolStack } = this;
    // console.log({ currentStackScope, stackIndex, symbolStack });
    this.currentStackScope.vars.push(variableName);
    const varsAvailable = this.symbolStack.reduce((acc, item) => {
      return acc.concat(item.vars);
    }, []);
    // console.log({ varsAvailable });
    // this.displaySymbolStack(variableName);
    return {
      ...ctx,
      varsAvailable
    };
  }
}
