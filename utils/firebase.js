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
};
