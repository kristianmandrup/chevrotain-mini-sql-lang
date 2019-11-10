export const regex = {
  or(...r: RegExp[]) {
    return new RegExp(r.map(({ source }) => `(${source})`).join("|"));
  },
  and(...r: RegExp[]) {
    return new RegExp(r.map(({ source }) => `(${source})`).join(""));
  },
  option(r: RegExp) {
    return new RegExp(`(${r.source})?`);
  },
  many(r: RegExp) {
    return new RegExp(`(${r.source})*`);
  }
};

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
