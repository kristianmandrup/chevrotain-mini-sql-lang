import { selectLexer } from "./lexer";
export { tokenVocabulary } from "./lexer";
export { selectLexer };

export const lex = (inputText: string) => {
  const lexingResult = selectLexer.tokenize(inputText);

  if (lexingResult.errors.length > 0) {
    throw Error("Sad Sad Panda, lexing errors detected");
  }

  return lexingResult;
};
