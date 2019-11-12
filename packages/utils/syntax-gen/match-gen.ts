import { error } from "./util";
import { createOrMatchesPattern } from "./util";

export const generateMatchObj = (data, opts) =>
  Object.keys(data).reduce((acc, key) => {
    const obj = data[key];
    const { name, matches } = obj.syntax || obj;
    if (!name) error("generateSyntaxObj: missing name", obj);
    const match = Array.isArray(matches)
      ? createOrMatchesPattern(matches, obj.syntax)
      : matches;
    const entry = {
      name: `${name}.${opts.ext}`,
      match
    };
    acc[key] = entry;
    return acc;
  }, {});
