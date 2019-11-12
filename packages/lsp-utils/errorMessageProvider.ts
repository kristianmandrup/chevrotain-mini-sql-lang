import { keywords as sparqlKeywords } from "../utils";
import { regexPatternToString } from "./language-services";
import { TokenType } from "chevrotain";

// TokenType
const getTokenDisplayName = (token: TokenType) => {
  const { name, PATTERN, LABEL } = token;
  if (LABEL) {
    return `${name} e.g. ${LABEL}`;
  }
  if (typeof PATTERN === "string") {
    return `'${PATTERN}'`;
  }
  if (name in sparqlKeywords) {
    return `'${regexPatternToString(PATTERN) || ""}'`;
  }
  return name;
};

const formatTokenPathsForDiagnostics = (paths: TokenType[][]): string =>
  paths
    .map(iterationPath =>
      iterationPath
        .map((token: TokenType) => getTokenDisplayName(token))
        .join(" ")
    )
    .join("\n ");

const buildEarlyExitMessage = options => {
  const { expectedIterationPaths, customUserDescription } = options;
  const formattedPaths = formatTokenPathsForDiagnostics(expectedIterationPaths);
  let expectationMessage = `\tExpected one of the following:\n ${formattedPaths}`;
  if (customUserDescription) {
    expectationMessage += `\n\n ${customUserDescription}`;
  }
  return expectationMessage;
};

const buildNoViableAltMessage = options => {
  const { expectedPathsPerAlt } = options;
  const formattedPathsPerAlt = expectedPathsPerAlt
    .map(alt => formatTokenPathsForDiagnostics(alt))
    .join("\n ");
  return `\tExpected one of the following:\n ${formattedPathsPerAlt}`;
};

const buildMismatchTokenMessage = options => {
  return `${getTokenDisplayName(options.expected)} expected.`;
};

const buildNotAllInputParsedMessage = () => "Expected EOF.";

export const errorMessageProvider = {
  buildEarlyExitMessage,
  buildNoViableAltMessage,
  buildMismatchTokenMessage,
  buildNotAllInputParsedMessage
};
