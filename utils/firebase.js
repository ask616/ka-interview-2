const secrets = require('./secrets');
const firebase = require('firebase');

/**
 * Interface between the app and Firebase backend
 * @type {Object}
 */
module.exports = {
  initialize() {
    firebase.initializeApp({
      databaseURL: secrets.databaseURL,
      serviceAccount: secrets.serviceCredentialsPath,
    });
  },

  /**
   * Pushes an object to the end of a list
   * @param  {string} path     Absolute path in db to save to
   * @param  {Object} newEntry New object to save
   * @return {Promise}         Data save promise
   */
  appendToList(path, newEntry) {
    const ref = firebase.database().ref(`/${path}`);
    return ref.push().set(newEntry);
  },

  get(path) {
    const ref = firebase.database().ref(`/${path}`);
    return ref.once('value');
  },

  /**
   * Retrieves only the first entry at a path
   * @param  {string} path Path in db to retrieve from
   * @return {Promise}      Retrieval snapshot promise
   */
  getFirst(path) {
    const ref = firebase.database().ref(`/${path}`);
    return ref.limitToFirst(1).once('value');
  },

  /**
   * Takes a snapshot and returns an representing the first child
   * @param  {Firebase.Snapshot} snapshot Snapshot of db path
   * @return {Object}          Object with first child's data
   */
  getFirstChild(snapshot) {
    const childData = {};

    snapshot.forEach((child) => {
      childData.data = child.val();
      childData.id = child.key;
      return true;
    });

    return childData;
  },

  getValue(snapshot) {
    return snapshot.val();
  },
};
