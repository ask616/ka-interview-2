const zipObject = require('lodash/zipObject');
const fill = require('lodash/fill');

module.exports = {
  listToObj: (list, defaultVal) => zipObject(list, fill(Array(list.length), defaultVal)),
};
