// "begin": "\\{",
// "beginCaptures": {
//     "0": {
//         "name": "meta.brace.curly.sqf"
//     }
// },
// "end": "\\}",
// "endCaptures": {
//     "0": {
//         "name": "meta.brace.curly.sqf"
//     }
// },
// $.consumeStx('LBrace', {...ctx, matches: '{', begin: 'meta.brace.curly'});
// $.subruleStx('expression', {...ctx, matches: 'expression'});
// $.consumeStx('RBrace', {...ctx, matches: '}', end: 'meta.brace.curly'})
import { createPatternRefs } from "./gen-ref";
import { regexpFor } from "./util";

export const generateBlockObj = (data, opts) =>
  Object.keys(data).reduce((acc, key) => {
    const obj = data[key];
    const { beginToken, endToken, name, references } = obj.syntax || obj;
    const patterns = createPatternRefs(references);
    const beginTokenName = [beginToken.name, opts.ext].join(".");
    const endTokenName = [endToken.name, opts.ext].join(".");
    acc[key] = {
      begin: regexpFor(beginToken.matches),
      beginCaptures: {
        "0": beginTokenName
      },
      end: regexpFor(endToken.matches),
      endCaptures: {
        "0": endTokenName
      },
      name: `${name}.${opts.ext}`,
      patterns
    };
    return acc;
  }, {});
