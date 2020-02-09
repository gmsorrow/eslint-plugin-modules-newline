const { IMPORT } = require('../constants');
const { lintModuleVariablesNewline } = require('./utils');

module.exports = {
  create: function (context) {
    return {
      ImportDeclaration(node) {
        lintModuleVariablesNewline(node, context, IMPORT)
      },
    }
  },
};
