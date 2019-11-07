import * as _ from "lodash";
import { tokenMatcher } from "chevrotain";
import { lex, tokenVocabulary } from "./lexer";

const context = describe;

describe("Chevrotain Tutorial", () => {
  context("Step 1 - Lexing", () => {
    it("Can Lex a simple input", () => {
      let inputText = "SELECT column1 FROM table2";
      let lexingResult = lex(inputText);

      expect(lexingResult.errors).toEqual([]);

      let tokens = lexingResult.tokens;
      expect(tokens).toHaveLength(4);
      expect(tokens[0].image).toEqual("SELECT");
      expect(tokens[1].image).toEqual("column1");
      expect(tokens[2].image).toEqual("FROM");
      expect(tokens[3].image).toEqual("table2");

      // tokenMatcher acts as an "instanceof" check for Tokens
      expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy();
      expect(tokenMatcher(tokens[1], tokenVocabulary.Identifier)).toBeTruthy();
      expect(tokenMatcher(tokens[2], tokenVocabulary.From)).toBeTruthy();
      expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy();
    });
  });
});
