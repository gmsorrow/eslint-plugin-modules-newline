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
    return null;
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
    return null;
  }

  for (let i = 1; i < moduleVariables.length; i++) {
    const firstTokenOfCurrentProperty = sourceCode.getFirstToken(moduleVariables[i]);
    const namedImportAfterDefault = moduleType === IMPORT
      && node.specifiers[i].type === 'ImportSpecifier'
      && (
        node.specifiers[i - 1]
        && node.specifiers[i - 1].type === 'ImportDefaultSpecifier'
      );
    if (!namedImportAfterDefault && moduleVariables[i].loc.start.line === moduleVariables[i - 1].loc.start.line) {
      context.report({
        node,
        message: `Each ${moduleTypeNameForMessage} variable should starts with a new line`,
        fix(fixer) {

          const sourceCode = context.getSourceCode();

          let comma = null;
          let rangeAfterComma = null;

          if (namedImportAfterDefault) {
            return null;
          } else {
            comma = sourceCode.getTokenBefore(firstTokenOfCurrentProperty);
            rangeAfterComma = [comma.range[1], firstTokenOfCurrentProperty.range[0]];
            // don't fix if comments between the comma and the next property.
            if (sourceCode.text.slice(rangeAfterComma[0], rangeAfterComma[1]).trim()) {
              return null;
            }
            return fixer.replaceTextRange(rangeAfterComma, "\n");
          }
        },
      });
    }
  }
}

module.exports = { lintModuleVariablesNewline };
