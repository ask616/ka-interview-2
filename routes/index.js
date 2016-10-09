var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/new', (req, res, next) => {
  res.render('new');
});

module.exports = router;
