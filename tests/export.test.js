"use strict";

const rule = require("../lib/rules/export-declaration-newline");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});


ruleTester.run("export-declaration-newline", rule, {
  valid: [
    "const name1 = 1; const name2 = 2; const nameN = 3; export { name1,\n name2,\n nameN };",
    "const name = 1; export { name };",
    "const v1 = 1; const v2 = 2; export { v1 as name1,\n v2 as name2 };",
    "export let name1, name2, nameN;",
    "export let name1 = 1, name2 = 2, nameN = 'n';",
    "export * from 'test';",
    "export { name1,\n name2,\n nameN } from 'test2';",
    "export { import1 as name1,\n import2 as name2 } from 'test3';",
    "const a = 1; const b = 2; export { a as default,\n b }",
    "export default function () {};",
    "export default function* () {}",
    "export default class Test {}",
    "export default function name1() {};",
    "export default function* name2() {};",
  ],
  invalid: [
    {
      code: "const name1 = 1; const name2 = 2; const nameN = 3; export { name1, name2,\n nameN };",
      output: "const name1 = 1; const name2 = 2; const nameN = 3; export { name1,\nname2,\n nameN };",
      errors: [
        {
          type: "ExportNamedDeclaration",
          line: 1,
          column: 52,
        },
      ],
    },
    {
      code: "const a = 1; const b = 2; export { a as default, b }",
      output: "const a = 1; const b = 2; export { a as default,\nb }",
      errors: [
        {
          type: "ExportNamedDeclaration",
          line: 1,
          column: 27,
        },
      ],
    },
  ],
});
