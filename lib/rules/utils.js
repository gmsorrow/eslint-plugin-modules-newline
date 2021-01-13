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
    if (moduleVariables[i].loc.start.line === moduleVariables[i - 1].loc.start.line) {
      const report = (fixer) => context.report({
        node,
        message: `Each ${moduleTypeNameForMessage} variable should starts with a new line`,
        fix: fixer,
      });

      const sourceCode = context.getSourceCode();
      const namedImportAfterDefault = moduleType === IMPORT
        && node.specifiers[i].type === 'ImportSpecifier'
        && (
          node.specifiers[i - 1]
          && node.specifiers[i - 1].type === 'ImportDefaultSpecifier'
        );

      if (namedImportAfterDefault) {
        if (moduleVariables.length <= 2) {
          return null;
        }
        const endOfDefaultImport = node.specifiers[i - 1].range[1];
        const beginningOfNamedImport = node.specifiers[i].range[0];

        const brace = sourceCode.tokensAndComments.find(
          (token) => token.type === "Punctuator"
            && token.value === "{"
            && token.range[0] >= endOfDefaultImport
            && token.range[1] <= beginningOfNamedImport
        );
        const rangeAfterBrace = [brace.range[0], brace.range[1]];

        report((fixer) => fixer.replaceTextRange(rangeAfterBrace, "{\n"));
      } else {
        const comma = sourceCode.getTokenBefore(firstTokenOfCurrentProperty);
        const rangeAfterComma = [comma.range[1], firstTokenOfCurrentProperty.range[0]];
        // don't fix if comments between the comma and the next property.
        if (sourceCode.text.slice(rangeAfterComma[0], rangeAfterComma[1]).trim()) {
          return null;
        }
        report((fixer) => fixer.replaceTextRange(rangeAfterComma, "\n"));
      }
    }
  }
}

module.exports = { lintModuleVariablesNewline };
