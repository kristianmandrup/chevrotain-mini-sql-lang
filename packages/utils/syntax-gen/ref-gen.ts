import { toArray } from "./util";

export const createPatternRefs = (list: any) =>
  toArray(list).reduce((acc, refName) => {
    acc.push({
      include: `#${refName}`
    });
    return acc;
  }, []);

export interface RefType {
  type: string;
  name: string;
  references: string[];
}

export const generateRefObj = (data: RefType[], opts) =>
  data.reduce((acc, obj: RefType) => {
    const { name, type } = obj;
    const patterns = createPatternRefs(obj.references);
    // console.log(obj, opts);
    acc[type] = {
      name: `${name}.${opts.ext}`,
      patterns
    };

    return acc;
  }, {});
