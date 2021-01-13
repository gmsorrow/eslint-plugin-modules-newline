"use strict";

const rule = require("../lib/rules/import-declaration-newline");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});


ruleTester.run("import-declaration-newline", rule, {
  valid: [
    "import {\nk1,\nk2,\nk3,\nk4\n} from 'something';",
    "import {\nk1\n, k2\n, k3\n, k4\n} from 'something';",
    "import { k1,\nk2,\nk3,\nk4 } from 'something';",
    "import { k1\n, k2\n, k3\n, k4 } from 'something';",
    "import { k1 } from 'something';",
    "import {\nk1\n} from 'something';",
    "import {} from 'something';",
    "import React, { useState } from 'react';",
    "import React, {\nuseState } from 'react';",
    "import React, {\nuseState, \nuseEffect } from 'react'",
  ],
  invalid: [
    {
      code: "import {\nk1, k2\n} from 'something';",
      output: "import {\nk1,\nk2\n} from 'something';",
      errors: [
        {
          type: "ImportDeclaration",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: "import { k1, k2, k3 } from 'something';",
      output: "import { k1,\nk2,\nk3 } from 'something';",
      errors: [
        {
          type: "ImportDeclaration",
          line: 1,
          column: 1,
        },
        {
          type: "ImportDeclaration",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: "import React, { useState, useEffect } from 'react';",
      output: "import React, {\n useState,\nuseEffect } from 'react';",
      errors: [
        {
          type: "ImportDeclaration",
          line: 1,
          column: 1,
        },
        {
          type: "ImportDeclaration",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: "import React, { useState,\nuseEffect } from 'react';",
      output: "import React, {\n useState,\nuseEffect } from 'react';",
      errors: [
        {
          type: "ImportDeclaration",
          line: 1,
          column: 1,
        },
      ],
    },
  ],
});
