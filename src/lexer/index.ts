import { SelectLexer } from "./lexer";
export { tokenVocabulary } from "./lexer";

export const lex = (inputText: string) => {
  const lexingResult = SelectLexer.tokenize(inputText);

  if (lexingResult.errors.length > 0) {
    throw Error("Sad Sad Panda, lexing errors detected");
  }

  return lexingResult;
};
