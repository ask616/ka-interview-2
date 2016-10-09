const firebase = require('./firebase');

module.exports = {
  sendError: (res, code, message) => {
    res.status(code || 500).json({ error: message });
  },

  checkNewProblemAttributes: (newProblem, res) => {
    if (!newProblem.problem || !newProblem.problem.length) {
      this.sendError(res, 400, 'Missing problem statement');
      return false;
    } else if (!newProblem.solution || !newProblem.solution.length) {
      this.sendError(res, 400, 'Missing solution statement');
      return false;
    }

    return true;
  },

  saveProblem: (newProblem, res) => {
    firebase.write();
  },
};
