const express = require('express');
const router = express.Router();
const routerUtils = require('../utils/router-utils');

/* GET home page. */
router.get('/', (req, res, next) => {
  routerUtils.getProblems(res);
});

/* GET problem submission page. */
router.get('/new', (req, res, next) => {
  res.render('new', { whitelistOptions: routerUtils.getSupportedNodes() });
});

/* POST new problem submission request */
router.post('/new', (req, res, next) => {
  if (routerUtils.checkNewProblemAttributes(req.body, res)) {
    routerUtils.saveProblem(req.body, res);
  }
});

/* POST student code validation request */
router.post('/validate', (req, res, next) => {
  if (routerUtils.checkValidationAttributes(req.body, res)) {
    routerUtils.validateCode(req.body, res);
  }
});

module.exports = router;
