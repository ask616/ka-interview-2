const zipObject = require('lodash/zipObject');
const fill = require('lodash/fill');
const intersection = require('lodash/intersection');

module.exports = {
  listToObj: (list, defaultVal) => zipObject(list, fill(Array(list.length), defaultVal)),

  hasElementsInCommon: (...lists) => intersection(...lists).length > 0,
};
