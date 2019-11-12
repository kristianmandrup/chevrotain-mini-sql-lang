import { GenerateRepoOpts } from "./types";
import { generateMatchObj } from "./match-gen";
import { generateBlockObj } from "./block-gen";
import { generateRefObj } from "./ref-gen";
import { error, warn } from "./util";

export const generateRepo = (data, opts: GenerateRepoOpts) => {
  const { ext } = opts;
  if (!ext) error("Missing ext in options");

  const refData = data.filter(item => item.references);
  const syntaxData = data.filter(item => item.syntax);
  const blockData = data.filter(item => item.block);

  const syntaxObj = generateMatchObj(syntaxData, opts);
  const blockObj = generateBlockObj(blockData, opts);
  const refObj = generateRefObj(refData, opts);

  return {
    ...syntaxObj,
    ...blockObj,
    ...refObj
  };
};
