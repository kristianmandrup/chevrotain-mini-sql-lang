import { regex } from "./regex";

export const CATCH_ALL = /[\s\S]*/; // equivalent to /.*/s, which isn't a JS standard yet
export const CATCH_ALL_AT_LEAST_ONE = /[\s\S]+/; // equivalent to /.+/s, which isn't a JS standard yet

export const IRIREF = /<[^<>\\{}|\^`\u0000-\u0020]*>/;
export const PN_CHARS_BASE = /[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF]/;
export const LANGTAG = /@[a-zA-Z]+(-[a-zA-Z0-9]+)*/;
export const INTEGER = /\d+/;
export const DECIMAL = /(\d*\.\d+)|(\d+\.\d*)/;
export const EXPONENT = /[eE][+-]?\d+/;
export const ECHAR = /\\[tbnrf"'\\]/;
export const WS = /[\u0020\u0009\u000d\u000a]/;
export const HEX = /[0-9A-Fa-f]/;
export const PN_LOCAL_ESC = /\\[_~.\-!\$&'()*+,=\/?#@%;]/;

export const PN_CHARS_U = regex.or(PN_CHARS_BASE, /_/);

export const PN_CHARS = regex.or(
  PN_CHARS_U,
  /-/,
  /\d/,
  /\u00b7/,
  /[\u0300-\u036f]/,
  /[\u203f-\u2040]/
);

export const PN_PREFIX = regex.and(
  PN_CHARS_BASE,
  regex.option(regex.and(regex.many(regex.or(PN_CHARS, /\./)), PN_CHARS))
);

export const PERCENT = regex.and(/%/, HEX, HEX);

export const PLX = regex.or(PERCENT, PN_LOCAL_ESC);

export const PN_LOCAL = regex.and(
  regex.or(PN_CHARS_U, /:/, /\d/, PLX),
  regex.option(
    regex.and(
      regex.many(regex.or(PN_CHARS, /\./, /:/, PLX)),
      regex.or(PN_CHARS, /:/, PLX)
    )
  )
);

export const VARNAME = regex.and(
  regex.or(PN_CHARS_U, /\d/),
  regex.many(
    regex.or(PN_CHARS_U, /\d/, /\u00b7/, /[\u0300-\u036f]/, /[\u203f-\u2040]/)
  )
);

export const ANON = regex.and(/\[/, regex.many(WS), /\]/);

export const NIL = regex.and(/\(/, regex.many(WS), /\)/);

export const STRING_LITERAL1 = regex.and(
  /'/,
  regex.many(regex.or(/[^\u0027\u005C\u000A\u000D]/, ECHAR)),
  /'/
);

export const STRING_LITERAL2 = regex.and(
  /"/,
  regex.many(regex.or(/[^\u0022\u005C\u000A\u000D]/, ECHAR)),
  /"/
);

export const STRING_LITERAL_LONG1 = regex.and(
  /'''/,
  regex.many(
    regex.and(regex.option(regex.or(/'/, /''/)), regex.or(/[^'\\]/, ECHAR))
  ),
  /'''/
);

export const STRING_LITERAL_LONG2 = regex.and(
  /"""/,
  regex.many(
    regex.and(regex.option(regex.or(/"/, /""/)), regex.or(/[^"\\]/, ECHAR))
  ),
  /"""/
);

export const DOUBLE = regex.or(
  regex.and(/\d+\.\d*/, EXPONENT),
  regex.and(/\.\d+/, EXPONENT),
  regex.and(/\d+/, EXPONENT)
);

export const INTEGER_POSITIVE = regex.and(/\+/, INTEGER);
export const DECIMAL_POSITIVE = regex.and(/\+/, DECIMAL);
export const DOUBLE_POSITIVE = regex.and(/\+/, DOUBLE);
export const INTEGER_NEGATIVE = regex.and(/-/, INTEGER);
export const DECIMAL_NEGATIVE = regex.and(/-/, DECIMAL);
export const DOUBLE_NEGATIVE = regex.and(/-/, DOUBLE);

export const VAR1 = regex.and(/\?/, VARNAME);
export const VAR2 = regex.and(/\$/, VARNAME);

export const BLANK_NODE_LABEL = regex.and(
  /_:/,
  regex.or(PN_CHARS_U, /\d/),
  regex.option(regex.and(regex.many(regex.or(PN_CHARS, /\./)), PN_CHARS))
);

export const PNAME_NS = regex.and(regex.option(PN_PREFIX), /:/);
export const PNAME_LN = regex.and(PNAME_NS, PN_LOCAL);
