export const displayJson = json => {
  return JSON.stringify(json, null, 2);
};

export class ScopeStackBuilder {
  symbolStack: any[] = [];

  get typeHandlerMap() {
    return {
      SCOPE: "scope",
      ASSIGNMENT: "assignment"
    };
  }

  build(ast) {
    return this.scope(ast);
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

  evaluate(statements: any[]) {
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

    const statements = this.evaluate(ctx.statements);
    this.symbolStack.pop();

    return {
      ...ctx,
      statements
    };
  }

  assignment(ctx: any) {
    const { variableName } = ctx;
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
