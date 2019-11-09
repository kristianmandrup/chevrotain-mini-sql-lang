import { BaseLanguageServer } from "../base-language-server/src/BaseLanguageServer";
import { TurtleParser } from "./turtle-parser";

const createParser = ({ errorMessageProvider }) =>
  new TurtleParser({ errorMessageProvider });

export const createMyLanguageServer = ({ connection, errorMessageProvider }) =>
  new BaseLanguageServer(connection, createParser({ errorMessageProvider }));
