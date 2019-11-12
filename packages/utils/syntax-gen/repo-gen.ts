import { GenerateRepoOpts } from "./types";
import { generateMatchObj } from "./match-gen";
import { generateBlockObj } from "./block-gen";
import { generateRefObj } from "./ref-gen";
import { error } from "./util";

export const isBlock = item => item.syntax && item.syntax.block;
export const isMatch = item => item.syntax && item.syntax.match;
export const isRef = item => !isBlock(item) && item.references;

export const generateRepo = (data, opts: GenerateRepoOpts) => {
  const { ext } = opts;
  if (!ext) error("Missing ext in options");

  const refData = data.filter(item => isRef(item));
  const matchData = data.filter(item => isMatch(item));
  const blockData = data.filter(item => isBlock(item));

  const syntaxObj = generateMatchObj(matchData, opts);
  const blockObj = generateBlockObj(blockData, opts);
  const refObj = generateRefObj(refData, opts);

  // console.log({
  //   syntaxObj,
  //   blockObj,
  //   refObj
  // });

  return {
    ...syntaxObj,
    ...blockObj,
    ...refObj
  };
};
