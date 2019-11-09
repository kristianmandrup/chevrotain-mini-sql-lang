import {
  IToken,
  IRecognitionException,
  CstNode,
  TokenType,
  IRecognizerContext
} from "chevrotain";

export interface IStandardParser {
  tokenize: (document: string) => IToken[];
  parse: (
    document: string
  ) => { errors: IRecognitionException[]; cst: CstNode };
}

export interface ITokensMap {
  [key: string]: IToken[];
}

export interface CstNodeMap {
  [key: string]: CstNode[];
}

export interface ISemanticError
  extends Pick<
    IRecognitionException,
    Exclude<keyof IRecognitionException, "resyncedTokens" | "context">
  > {
  resyncedTokens?: IToken[];
  context?: IRecognizerContext;
}

type Lit = string | number | boolean | undefined | null | void | symbol | {};
export const getAsTypedTuple = <T extends Lit[]>(...args: T): T => args;

// exported for convenience
export { IToken, CstNode, TokenType };
