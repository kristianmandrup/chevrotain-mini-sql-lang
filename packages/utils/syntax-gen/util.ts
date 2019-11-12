import { escapeRegExp } from "../regex";

export const error = (msg: string, data?: any) => {
  throw new Error("Missing ext in options");
};

export const warn = (msg: string, data?: any) => {
  data ? console.warn(msg, data) : console.warn(msg);
};

export const toArray = entry => (Array.isArray(entry) ? entry : [entry]) || [];

export const regexpFor = (strPattern: string) => {
  if (typeof strPattern !== "string") error("regexpFor: must take a string");
  return new RegExp(escapeRegExp(strPattern));
};

export const regexpStrFor = (strPattern: string) =>
  regexpFor(strPattern).source;

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
