const express = require('express');
const router = express.Router();
const routerUtils = require('../utils/router-utils');

/* GET home page. */
router.get('/', (req, res, next) => {
  routerUtils.getProblems(res);
});

router.get('/new', (req, res, next) => {
  res.render('new', { whitelistOptions: routerUtils.getSupportedNodes() });
});

router.post('/new', (req, res, next) => {
  if (routerUtils.checkNewProblemAttributes(req.body, res)) {
    routerUtils.saveProblem(req.body, res);
  }
});

router.get('/validate', (req, res, next) => {
  if (routerUtils.checkValidationAttributes(req.body, res)) {
    routerUtils.validateCode(req.body, res);
  }
});

module.exports = router;
