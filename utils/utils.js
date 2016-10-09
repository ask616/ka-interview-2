const intersection = require('lodash/intersection');

module.exports = {
  hasElementsInCommon: (...lists) => intersection(...lists).length > 0,

  recursivePick(object, key) {
    const newObj = {};
    newObj[key] = object[key];

    newObj.children = (!object.children || object.children.length === 0)
      ? []
      : newObj.children = object.children.map(child => this.recursivePick(child, key));

    return newObj;
  },
};
