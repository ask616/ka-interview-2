const intersection = require('lodash/intersection');

/**
 * General utility functions throughout the app
 * @type {Object}
 */
module.exports = {
  /**
   * Returns whether or not lists have any elements in common
   * @param  {...[Array]} lists Lists to check
   * @return {boolean}
   */
  hasElementsInCommon: (...lists) => intersection(...lists).length > 0,

  /**
   * Recurses through an object, projecting away all properties but key
   * @param  {Object} object    Object to recurse through
   * @param  {string} key       The key to retain
   * @param  {Array\undefined} valueList List of all values of key found so far
   * @return {Object}           The picked object and list of all values
   */
  recursivePick(object, key, valueList) {
    valueList = valueList || [];
    const newObj = {};
    newObj[key] = object[key];
    valueList.push(object[key]);

    newObj.children = (!object.children || object.children.length === 0)
      // If no children, then terminate
      ? []
      // Otherwise, make a recursive call on all children
      : newObj.children = object.children.map(child =>
        this.recursivePick(child, key, valueList).newObject);

    return { newObject: newObj, valueList };
  },
};
