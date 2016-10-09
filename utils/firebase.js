const secrets = require('./secrets');
const firebase = require('firebase');

module.exports = {
  initialize() {
    firebase.initializeApp({
      databaseURL: secrets.databaseURL,
      serviceAccount: secrets.serviceCredentialsPath,
    });
  },

  appendToList(path, newEntry) {
    const ref = firebase.database().ref(`/${path}`);
    return ref.push().set(newEntry);
  },

  get(path) {
    const ref = firebase.database().ref(`/${path}`);
    return ref.once('value');
  },

  getFirst(path) {
    const ref = firebase.database().ref(`/${path}`);
    return ref.limitToFirst(1).once('value');
  },

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
