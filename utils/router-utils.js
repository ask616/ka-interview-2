const firebase = require('./firebase');
const supportedNodes = require('./constants/supported-nodes');
const estreeNodes = require('./constants/estree-nodes');
const utils = require('./utils');
const estree = require('./estree');

/**
 * Runs input validation and handles responses for the router
 * @type {Object}
 */
module.exports = {
  checkNewProblemAttributes(newProblem, res) {
    if (!newProblem.display || !newProblem.display.length) {
      this.sendError(res, 400, 'Missing problem statement');
      return false;
    } else if (utils.hasElementsInCommon(newProblem.blacklist, newProblem.whitelist)) {
      this.sendError(res, 400, 'Elements cannot be both whitelisted and blacklisted');
      return false;
    }

    return true;
  },

  checkValidationAttributes(toValidate, res) {
    if (!toValidate.code || !toValidate.code.length) {
      this.sendError(res, 400, 'Missing code to validate');
      return false;
    } else if (!toValidate.id || !toValidate.id.length) {
      this.sendError(res, 400, 'Missing problem id');
      return false;
    }

    return true;
  },

  saveProblem(newProblem, res) {
    // Get rid of extra data from the jsTree
    this.massageStructureData(newProblem);
    firebase.appendToList('problems', newProblem)
      .then((success) => {
        this.sendSuccess(res, 200, success);
      })
      .catch((error) => {
        this.sendError(res, 400, error);
      });
  },

  // TODO: validate that child key exists
  validateCode(toValidate, res) {
    firebase.get(`problems/${toValidate.id}`)
      .then((snapshot) => {
        const problemData = firebase.getValue(snapshot);
        const code = toValidate.code;

        const whitelist = problemData.whitelist || [];
        const blacklist = problemData.blacklist || [];
        const structureData = problemData.structureData || {};
        const typeList = problemData.typeList || {};

        const results = estree.validateCode(code, whitelist, blacklist, structureData, typeList);
        const { whitelistViolations, blacklistViolations, structureViolation, success } = results;
        const whitelistDisplays = estreeNodes.getDisplayStrings(whitelistViolations);
        const blacklistDisplays = estreeNodes.getDisplayStrings(blacklistViolations);
        this.sendSuccess(res, 200, results.status,
                         { whitelistViolations: whitelistDisplays,
                          blacklistViolations: blacklistDisplays,
                          structureViolation,
                          success });
      });
  },

  /**
   * Returns the first problem in the db for display
   * @param  {Object} res Express response object
   */
  getProblems(res) {
    firebase.getFirst('problems')
      .then((snapshot) => {
        const problem = this.buildProblemObject(snapshot);
        res.render('index', { problem });
      })
      .catch((error) => {
        res.sendError(res, 400, 'Failed to retrieve from DB');
      });
  },

  /**
   * Gets rid of excess data from the jsTree and keeps only the essential program
   * structure. Additionally stores a list of all elements expected in the program
   * structure. Note that the function is destructive!
   * @param  {Object} newProblem New problem submission object
   * @return {Object}            Modified problem object
   */
  massageStructureData(newProblem) {
    if (!newProblem.structureData) {
      return newProblem;
    }

    const newStructureData = utils.recursivePick(newProblem.structureData[0], 'type');
    newProblem.structureData = newStructureData.newObject;
    newProblem.typeList = newStructureData.valueList;
    return newProblem;
  },

  getSupportedNodes: () => supportedNodes.getSupportedNodesDisplay(),

  sendError(res, code, message) {
    res.status(code || 500).json({ error: message });
  },

  sendSuccess(res, code, message, data) {
    data = data || {};
    const replyData = Object.assign({ success: message }, data);
    res.status(code || 200).json(replyData);
  },

  buildProblemObject(snapshot) {
    return firebase.getFirstChild(snapshot);
  },
};
