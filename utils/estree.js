const estraverse = require('estraverse');
const esprima = require('esprima');

module.exports = {

  validateCode(code, whitelist, blacklist) {
    return this.parseTree(code, whitelist, blacklist);
  },

  parseTree(code, whitelist, blacklist) {
    let ast;

    try {
      ast = esprima.parse(code);
    } catch (err) {
      const result = {
        whitelistViolations: [],
        blacklistViolations: [],
        status: 'Syntax error',
        success: false,
      };

      return result;
    }

    const whitelistCopy = whitelist.slice();
    const blacklistViolations = [];
    const preorder = new Map();
    const postorder = new Map();
    let clock = 0;

    estraverse.traverse(ast, {
      enter(node) {
        preorder.set(node, clock);
        clock += 1;

        const whitelistIndex = whitelistCopy.indexOf(node.type);
        if (whitelistIndex >= 0) {
          whitelistCopy.splice(whitelistIndex, 1);
        } else if (blacklist.indexOf(node.type) >= 0) {
          blacklistViolations.push(node.type);
        }
      },
      leave(node) {
        postorder.set(node, clock);
        clock += 1;
      },
    });

    const results = {
      whitelistViolations: whitelistCopy,
      blacklistViolations,
      status: 'Validated',
      success: true,
    };

    return results;
  },
};
