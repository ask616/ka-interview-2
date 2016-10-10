const estraverse = require('estraverse');
const esprima = require('esprima');
const utils = require('./utils');

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
    const preorder = [];
    const postorder = [];
    let clock = 0;

    estraverse.traverse(ast, {
      enter(node) {
        // Only need to add to the preorder if we will be looking for it
        // during structure verification
        if (typeList.indexOf(node.type) >= 0) {
          preorder.push({ type: node.type, clock });
          clock += 1;
        }

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
          postorder.push({ type: node.type, clock });
          clock += 1;
        }
      },
    });

    const structureViolation = this.checkStructure(preorder, postorder, structureData);

    // Any elements leftover from the whitelist haven't been found while traversing
    const results = {
      whitelistViolations: whitelistCopy,
      blacklistViolations,
      structureViolation,
      status: 'Validated',
      success: true,
    };

    return results;
  },

  /**
   * We use dynamic programming to compare the structure of the student's code and the
   * expected structure. We build traversal lists of both structures, and run an
   * algorithm to find the longest matching subsequence between them.
   * @param  {Array} preorder      Preorder visit data for nodes
   * @param  {Array} postorder     Postorder visit data for nodes
   * @param  {Object} structureData The expected structure of the student's code
   * @return {Boolean}               Whether or not the student's code matches
   */
  checkStructure(preorder, postorder, structureData) {
    // Load the entire order of traversal through the student's code
    const codeTraversal = new Array(preorder.length * 2);

    preorder.forEach((node) => {
      codeTraversal[node.clock] = node.type;
    });

    postorder.forEach((node) => {
      codeTraversal[node.clock] = node.type;
    });

    // Get the order of traversal through the required structure
    const structureDataTraversal = this.traverseStructureData(structureData);

    // Create a table for the dynamically programmed algorithm
    const subsequenceMatchTable =
      utils.init2dArray(codeTraversal.length + 1, structureDataTraversal.length + 1);

    for (let i = 0; i <= codeTraversal.length; i += 1) {
      for (let j = 0; j <= structureDataTraversal.length; j += 1) {
        if (j === 0 || i === 0) {
          subsequenceMatchTable[i][j] = 0;
        } else {
          // Subproblem 1: Skip the last entry in codeTraversal
          const sp1 = subsequenceMatchTable[i - 1][j];
          // Subproblem 2: Skip the last entry in structureDataTraversal
          const sp2 = subsequenceMatchTable[i][j - 1];
          // Subproblem 3: Skip both last entries, and check if they match
          const sp3 = subsequenceMatchTable[i - 1][j - 1] +
            (codeTraversal[i] === structureDataTraversal[j] ? 1 : 0);
          // We want the longest matching subsequence, so store the max length among subproblems
          subsequenceMatchTable[i][j] = Math.max(sp1, sp2, sp3);
        }
      }
    }

    return subsequenceMatchTable[codeTraversal.length][structureDataTraversal.length]
      !== structureDataTraversal.length;
  },

  /**
   * Builds a list of the nodes with both pre and post order visits
   */
  traverseStructureData(structureData, traversal) {
    traversal = traversal || [];
    // Pre order visit
    traversal.push(structureData.type);

    if (structureData.children) {
      structureData.children.forEach((child) => {
        this.traverseStructureData(child, traversal);
      });
    }

    // Post order visit
    traversal.push(structureData.type);
    return traversal;
  },

};
