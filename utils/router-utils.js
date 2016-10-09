const firebase = require('./firebase');
const supportedNodes = require('./constants/supported-nodes');
const utils = require('./utils');

module.exports = {
  checkNewProblemAttributes(newProblem, res) {
    if (!newProblem.problem || !newProblem.problem.length) {
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
    }

    return true;
  },

  saveProblem(newProblem, res) {
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
    const data = firebase.get(`problems/${toValidate.id}`)
      .then((snapshot) => {
        const problemData = firebase.getValue(snapshot);
        const code = toValidate.code;
      });
  },

  getProblems(res) {
    firebase.getFirst('problems')
      .then((snapshot) => {
        const problem = this.buildProblemObject(snapshot);
        res.render('index', { problem });
      })
      .catch((error) => {
        res.sendError(res, 400, 'Failed to retrieve from server');
      });
  },

  getSupportedNodes: () => supportedNodes.getSupportedNodesDisplay(),

  sendError(res, code, message) {
    res.status(code || 500).json({ error: message });
  },

  sendSuccess(res, code, message) {
    res.status(code || 200).json({ success: message });
  },

  buildProblemObject(snapshot) {
    return firebase.getFirstChild(snapshot);
  },
};
