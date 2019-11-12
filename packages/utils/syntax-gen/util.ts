import { escapeRegExp } from "../regex";

export const error = (msg: string, data?: any) => {
  throw new Error("Missing ext in options");
};

export const warn = (msg: string, data?: any) => {
  data ? console.warn(msg, data) : console.warn(msg);
};

export const regexpFor = strPattern => new RegExp(escapeRegExp(strPattern));

export const createOrMatchesPattern = (list: string[], syntax: any) => {
  if (list.length === 0) {
    throw Error(
      `createOrMatchesPattern: missing matches option for ${syntax.name}`
    );
  }
  const orStr = list.join("|");
  const strPattern = "\\s*(?i)(" + orStr + ")\\b";
  return regexpFor(strPattern);
};
