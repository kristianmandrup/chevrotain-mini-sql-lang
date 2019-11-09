import { CstParser } from "chevrotain";
import { tokenVocabulary } from "../lexer/lexer";

// individual imports, prefer ES6 imports if supported in your runtime/transpiler...
const Select = tokenVocabulary.Select;
const From = tokenVocabulary.From;
const Where = tokenVocabulary.Where;
const Identifier = tokenVocabulary.Identifier;
const Integer = tokenVocabulary.Integer;
const GreaterThan = tokenVocabulary.GreaterThan;
const LessThan = tokenVocabulary.LessThan;
const Comma = tokenVocabulary.Comma;

export class SelectParser extends CstParser {
  constructor() {
    super(tokenVocabulary);
    this.createRules();
  }

  createRules() {
    // for conciseness
    const $: any = this;

    $.RULE("selectStatement", () => {
      $.SUBRULE($.selectClause);
      $.SUBRULE($.fromClause);
      $.OPTION(() => {
        $.SUBRULE($.whereClause);
      });
    });

    $.RULE("selectClause", () => {
      $.CONSUME(Select);
      $.AT_LEAST_ONE_SEP({
        SEP: Comma,
        DEF: () => {
          $.CONSUME(Identifier);
        }
      });
    });

    $.RULE("fromClause", () => {
      $.CONSUME(From);
      $.CONSUME(Identifier);
    });

    $.RULE("whereClause", () => {
      $.CONSUME(Where);
      $.SUBRULE($.expression);
    });

    // The "rhs" and "lhs" (Right/Left Hand Side) labels will provide easy
    // to use names during CST Visitor (step 3a).
    $.RULE("expression", () => {
      $.SUBRULE($.atomicExpression, { LABEL: "lhs" });
      $.SUBRULE($.relationalOperator);
      $.SUBRULE2($.atomicExpression, { LABEL: "rhs" }); // note the '2' suffix to distinguish
      // from the 'SUBRULE(atomicExpression)'
      // 2 lines above.
    });

    $.RULE("atomicExpression", () => {
      $.OR([
        { ALT: () => $.CONSUME(Integer) },
        { ALT: () => $.CONSUME(Identifier) }
      ]);
    });

    $.RULE("relationalOperator", () => {
      $.OR([
        { ALT: () => $.CONSUME(GreaterThan) },
        { ALT: () => $.CONSUME(LessThan) }
      ]);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

// We only ever need one as the parser internal state is reset for each new input.
export const parserInstance: any = new SelectParser();
