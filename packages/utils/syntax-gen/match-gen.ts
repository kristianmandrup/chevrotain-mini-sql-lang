import { error } from "./util";
import { matchPattern, createOrMatchesPattern } from "./util";

export interface MatchType {
  type: string;
  name: string;
  matches: string[] | string;
}

export const generateMatchObj = (data: any[], opts) =>
  data.reduce((acc, obj: any) => {
    const $obj: MatchType = obj.syntax || obj;
    const { type, name, matches } = $obj;
    if (!name) error("generateSyntaxObj: missing name", obj);
    const match = Array.isArray(matches)
      ? createOrMatchesPattern(matches, $obj)
      : matchPattern(matches);
    const entry = {
      name: `${name}.${opts.ext}`,
      match
    };
    acc[type] = entry;
    return acc;
  }, {});
