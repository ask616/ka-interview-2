const firebase = require('./firebase');

module.exports = {
  checkNewProblemAttributes(newProblem, res) {
    if (!newProblem.problem || !newProblem.problem.length) {
      this.sendError(res, 400, 'Missing problem statement');
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

  getProblems(res) {
    firebase.get('problems')
      .then((snapshot) => {
        const problems = this.buildListFromSnapshot(snapshot);
        res.render('index', { problems });
      })
      .catch((error) => {
        res.sendError(res, 400, error);
      });
  },

  sendError(res, code, message) {
    res.status(code || 500).json({ error: message });
  },

  sendSuccess(res, code, message) {
    res.status(code || 200).json({ success: message });
  },

  buildListFromSnapshot(snapshot) {
    const list = new Array(snapshot.numChildren());
    let i = 0;

    snapshot.forEach((child) => {
      list[i] = child.val();
      i += 1;
    });

    return list;
  },
};
