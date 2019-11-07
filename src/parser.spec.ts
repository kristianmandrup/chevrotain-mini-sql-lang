import * as _ from "lodash";
import { parse } from "./parser";

describe("Chevrotain Tutorial", () => {
  describe("Step 2 - Parsing", () => {
    it("Can Parse a simple input", () => {
      let inputText = "SELECT column1 FROM table2";
      expect(() => parse(inputText)).not.toThrow();
    });

    describe("invalid input", () => {
      let inputText = "SELECT FROM table2";

      it("Will throw an error for an invalid input", () => {
        // missing table name

        expect(() => parse(inputText)).toThrow(
          "expecting at least one iteration which starts with one of these possible Token sequences"
        );
      });

      it("Will throw an error for an invalid input", () => {
        // missing table name
        expect(() => parse(inputText)).toThrow(
          "<[Identifier]>\nbut found: 'FROM'"
        );
      });
    });
  });
});
