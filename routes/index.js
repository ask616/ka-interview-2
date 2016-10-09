const express = require('express');
const router = express.Router();
const routerUtils = require('../utils/router-utils');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/new', (req, res, next) => {
  res.render('new', { whitelistOptions: [{ name: 'Return Statement', id: 'ReturnStatement' }, { name: 'Break Statement', id: 'BreakStatement' }] });
});

router.post('/new', (req, res, next) => {
  if (!routerUtils.checkNewProblemAttributes(req.body, res)) {
    routerUtils.saveProblem(req.body, res);
  }
});

module.exports = router;
