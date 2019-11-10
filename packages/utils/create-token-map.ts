// createTokenMap({
//   Identifier: { name: "Identifier", pattern: /[a-zA-Z]\w*/ },
//   From: { name: "From", pattern: /FROM/, matches: 'FROM', longer_alt: '#Identifier'},
//   Where: { name: "Where", pattern: /WHERE/, matches: 'WHERE', longer_alt: Identifier }
// })

export const createTokenMap = (tokenMap, createToken) => {
  return tokenMap.reduce((acc, key) => {
    const tokenObj = tokenMap[key];
    acc[key] = {
      token: createToken(tokenObj),
      matches: tokenObj.matches
    };
    return acc;
  }, {});
};
