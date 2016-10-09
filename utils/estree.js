const estraverse = require('estraverse');
const esprima = require('esprima');
const utils = require('./utils');

module.exports = {

  parseTree(code, whitelist, blacklist) {
    const ast = esprima.parse(code);
    const whitelistObj = utils.listToObj(whitelist, true);
    const blacklistObj = utils.listToObj(whitelist, true);
    const blacklistViolations = [];

    estraverse.traverse(ast, {
      enter: (node) => {
        if (whitelistObj[node.type]) {
          delete whitelistObj[node.type];
        } else if (blacklistObj[node.type]) {
          blacklistViolations.push(node.type);
        }
      },
    });
  },
};
