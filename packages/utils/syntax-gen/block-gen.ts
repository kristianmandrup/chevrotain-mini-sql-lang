import { createPatternRefs } from "./ref-gen";
import { regexpStrFor } from "./util";
import { GenerateSyntaxOpts } from "./types";

interface RangeToken {
  name: string;
  matches: string;
}

export interface BlockType {
  type: string;
  beginToken: RangeToken;
  endToken: RangeToken;
  name: string;
  references: string[];
}

export const generateBlockObj = (data: any[], opts: GenerateSyntaxOpts) =>
  data.reduce((acc, obj: any) => {
    const $obj: BlockType = obj.syntax || obj;
    const { type, beginToken, endToken, name, references } = $obj;
    const patterns = createPatternRefs(references);
    const beginTokenName = [beginToken.name, opts.ext].join(".");
    const endTokenName = [endToken.name, opts.ext].join(".");
    acc[type] = {
      begin: regexpStrFor(beginToken.matches),
      beginCaptures: {
        "0": beginTokenName
      },
      end: regexpStrFor(endToken.matches),
      endCaptures: {
        "0": endTokenName
      },
      name: `${name}.${opts.ext}`,
      patterns
    };
    return acc;
  }, {});
