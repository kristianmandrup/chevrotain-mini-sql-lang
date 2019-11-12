import { toArray } from "./util";

export const createPatternRefs = (list: any[]) =>
  toArray(list).reduce((acc, refName) => {
    acc.push({
      include: `#${refName}`
    });
    return acc;
  }, []);

export const generateRefObj = (data, opts) =>
  Object.keys(data).reduce((acc, key) => {
    const obj = data[key];
    const patterns = createPatternRefs(obj.references);
    // console.log(obj, opts);
    acc[key] = {
      name: `${obj.name}.${opts.ext}`,
      patterns
    };

    return acc;
  }, {});
