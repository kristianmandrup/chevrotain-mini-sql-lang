import { turtleTokenTypes } from "./tokens";
import {
  Parser,
  IParserConfig,
  Lexer,
  IToken,
  IRecognitionException,
  IMultiModeLexerDefinition,
  TokenType
} from "chevrotain";
import { IStardogParser } from "../standard/helpers/types";

export class TurtleParser extends Parser implements IStardogParser {
  protected lexer: Lexer;

  // Parsing Turtle requires that the parser keep a map of namespaces in state.
  // Empty prefixes, for example, are allowed only if the empty prefix has been
  // added to the namespaces map (for now, that's all this tracks). (TODO: We
  // might want to use a visitor for this, but I'm doing it quick-and-dirty for
  // now.)
  // See here: https://www.w3.org/TR/turtle/#handle-PNAME_LN
  protected namespacesMap = {};
  protected semanticErrors: IRecognitionException[] = [];

  // Clears the state that we have to manage on our own for each parse (see
  // above for details).
  protected resetManagedState = () => {
    this.namespacesMap = {};
    this.semanticErrors = [];
  };

  public tokenize = (document: string): IToken[] =>
    this.lexer.tokenize(document).tokens;

  public parse = (
    document: string
  ): {
    errors: IRecognitionException[];
    semanticErrors: IRecognitionException[];
    cst: any;
  } => {
    this.input = this.lexer.tokenize(document).tokens;
    const cst = this.turtleDoc();
    // Next two items are copied so that they can be returned/held after parse
    // state is cleared.
    const errors: IRecognitionException[] = [...this.errors];
    const semanticErrors: IRecognitionException[] = [...this.semanticErrors];
    this.resetManagedState();

    return {
      errors,
      semanticErrors,
      cst
    };
  };

  constructor(
    config?: Partial<IParserConfig>,
    tokens = turtleTokenTypes,
    lexerDefinition: TokenType[] | IMultiModeLexerDefinition = tokens,
    performSelfAnalysis = true
  ) {
    super(tokens, {
      outputCst: true,
      recoveryEnabled: true,
      ...config
    });
    this.lexer = new Lexer(lexerDefinition);

    if (performSelfAnalysis) {
      Parser.performSelfAnalysis(this);
    }
  }

  turtleDoc = this.RULE("turtleDoc", () => {
    this.MANY(() => this.SUBRULE(this.statement));
  });

  statement = this.RULE("statement", () => {});
}
