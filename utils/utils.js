const zipObject = require('lodash/zipObject');
const fill = require('lodash/fill');
const intersection = require('lodash/intersection');

module.exports = {
  hasElementsInCommon: (...lists) => intersection(...lists).length > 0,
};
