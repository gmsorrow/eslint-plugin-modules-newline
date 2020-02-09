const { IMPORT } = require('../constants');

/**
 * Enforce placing import and export variables on separate lines
 * @param node
 * @param context
 * @param moduleType - export or import
 * @returns {{range: int[], text: string}|null}
 */
function lintModuleVariablesNewline(node, context, moduleType) {
  if (node.specifiers.length < 2) {
    return;
  }
  const sourceCode = context.getSourceCode();
  const moduleTypeNameForMessage = moduleType === IMPORT ? 'imported' : 'exported';

  let moduleVariables = null;
  if (node.specifiers) {
    // for import
    moduleVariables = node.specifiers;
  } else if (node.declaration.type === 'ObjectExpression') {
    // for some exports (export { a, b, c }
    moduleVariables = node.declaration.properties
  }

  if (!moduleVariables) {
    return;
  }

  for (let i = 1; i < moduleVariables.length; i++) {
    const firstTokenOfCurrentProperty = sourceCode.getFirstToken(moduleVariables[i]);
    if (moduleVariables[i].loc.start.line === moduleVariables[i - 1].loc.start.line) {
      context.report({
        node,
        message: `Each ${moduleTypeNameForMessage} variable should starts with a new line`,
        fix(fixer) {
          const sourceCode = context.getSourceCode();
          const comma = sourceCode.getTokenBefore(firstTokenOfCurrentProperty);
          const rangeAfterComma = [comma.range[1], firstTokenOfCurrentProperty.range[0]];

          // don't fix if comments between the comma and the next property.
          if (sourceCode.text.slice(rangeAfterComma[0], rangeAfterComma[1]).trim()) {
            return null;
          }

          return fixer.replaceTextRange(rangeAfterComma, "\n");
        },
      });
    }
  }
}

module.exports = { lintModuleVariablesNewline };
