// Tutorial Step 3a:

// Adding Actions(semantics) to our grammar using a CST Visitor.

import { lex } from "../lexer";
// re-using the parser implemented in step two.
import * as parser from "../parser";

const SelectParser: any = parser.SelectParser;

// A new parser instance with CST output (enabled by default).
const parserInstance = new SelectParser([]);
// The base visitor class can be accessed via the a parser instance.
const BaseSQLVisitor: any = parserInstance.getBaseCstVisitorConstructor();

export class SQLToAstVisitor extends BaseSQLVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  selectStatement(ctx: any) {
    // "this.visit" can be used to visit none-terminals and will invoke the correct visit method for the CstNode passed.
    const select = this.visit(ctx.selectClause);

    //  "this.visit" can work on either a CstNode or an Array of CstNodes.
    //  If an array is passed (ctx.fromClause is an array) it is equivalent
    //  to passing the first element of that array
    const from = this.visit(ctx.fromClause);

    // "whereClause" is optional, "this.visit" will ignore empty arrays (optional)
    const where = this.visit(ctx.whereClause);

    return {
      type: "SELECT_STMT",
      selectClause: select,
      fromClause: from,
      whereClause: where
    };
  }

  selectClause(ctx: any) {
    // Each Terminal or Non-Terminal in a grammar rule are collected into
    const columns = ctx.Identifier.map((identToken: any) => identToken.image);
    // an array with the same name(key) in the ctx object.

    return {
      type: "SELECT_CLAUSE",
      columns: columns
    };
  }

  fromClause(ctx: any) {
    const tableName = ctx.Identifier[0].image;

    return {
      type: "FROM_CLAUSE",
      table: tableName
    };
  }

  whereClause(ctx: any) {
    const condition = this.visit(ctx.expression);

    return {
      type: "WHERE_CLAUSE",
      condition: condition
    };
  }

  expression(ctx: any) {
    // Note the usage of the "rhs" and "lhs" labels defined in step 2 in the expression rule.
    const lhs = this.visit(ctx.lhs[0]);
    const operator = this.visit(ctx.relationalOperator);
    const rhs = this.visit(ctx.rhs[0]);

    return {
      type: "EXPRESSION",
      lhs: lhs,
      operator: operator,
      rhs: rhs
    };
  }

  // these two visitor methods will return a string.
  atomicExpression(ctx: any) {
    if (ctx.Integer) {
      return ctx.Integer[0].image;
    } else {
      return ctx.Identifier[0].image;
    }
  }

  relationalOperator(ctx: any) {
    if (ctx.GreaterThan) {
      return ctx.GreaterThan[0].image;
    } else {
      return ctx.LessThan[0].image;
    }
  }
}

// Our visitor has no state, so a single instance is sufficient.
const toAstVisitorInstance: any = new SQLToAstVisitor();

export const toAst = (inputText: string) => {
  const lexResult = lex(inputText);

  // ".input" is a setter which will reset the parser's internal's state.
  parserInstance.input = lexResult.tokens;

  // Automatic CST created when parsing
  const cst = parserInstance.selectStatement();

  if (parserInstance.errors.length > 0) {
    throw Error(
      "Sad sad panda, parsing errors detected!\n" +
        parserInstance.errors[0].message
    );
  }

  const ast = toAstVisitorInstance.visit(cst);
  // console.log("AST - visitor", ast);
  return ast;
};
