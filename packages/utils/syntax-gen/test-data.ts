export const testData = {
  "var-ref": {
    syntax: {
      name: "variable.other.private",
      matches: /[a-zA-Z]\w*/,
      in: "expression"
    }
  },
  "control-statement": {
    syntax: {
      name: "keyword.control",
      matches: ["FROM", "WHERE"], // based on referenced token matches values
      in: "expression"
    }
  },
  expression: {
    references: ["control-statement", "var-ref"]
  }
};
