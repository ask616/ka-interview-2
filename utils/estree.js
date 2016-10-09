const estraverse = require('estraverse');
const esprima = require('esprima');

/**
 * Provides functions for syntactical analysis using esprima and
 * estraverse for AST traversal
 * @type {Object}
 */
module.exports = {
  validateCode(code, whitelist, blacklist, structureData, typeList) {
    return this.parseTree(code, whitelist, blacklist, structureData, typeList);
  },

  /**
   * Traverses through the AST, checking for any elements that violate either the
   * blacklist or whitelist, and creates a pre/postorder map for structure verification
   * @param  {string} code          Student's raw code string
   * @param  {Array} whitelist     List of whitelisted elements
   * @param  {Array} blacklist     List of blacklisted elements
   * @param  {Object} structureData Object containing expected program structure
   * @param  {Array} typeList      List containing all expected elements in program structure
   * @return {Object}               Object with violations and success boolean
   */
  parseTree(code, whitelist, blacklist, structureData, typeList) {
    let ast;

    try {
      ast = esprima.parse(code);
    } catch (err) {
      // Esprima throws an error is there is a syntax issue, so we won't change
      // the alert on the user's view
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
        // Only need to add to the preorder if we will be looking for it
        // during structure verification
        if (typeList.indexOf(node.type) >= 0) {
          preorder.set(node, clock);
        }
        clock += 1;

        const whitelistIndex = whitelistCopy.indexOf(node.type);
        if (whitelistIndex >= 0) {
          // If the element is in our whitelist, remove it from the array as it's
          // been found
          whitelistCopy.splice(whitelistIndex, 1);
        } else if (blacklist.indexOf(node.type) >= 0) {
          // If the element is on our blacklist, save it to return to the user
          blacklistViolations.push(node.type);
        }
      },
      leave(node) {
        if (typeList.indexOf(node.type) >= 0) {
          postorder.set(node, clock);
        }
        clock += 1;
      },
    });

    // Any elements leftover from the whitelist haven't been found while traversing
    const results = {
      whitelistViolations: whitelistCopy,
      blacklistViolations,
      status: 'Validated',
      success: true,
    };

    // checkStructure(preorder, postorder, structureData);

    return results;
  },

  checkStructure(preorder, postorder, structureData, typeList) {

  },
};
