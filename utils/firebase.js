const secrets = require('./secrets');
const firebase = require('firebase');

module.exports = {
  initialize: () => {
    firebase.initializeApp({
      databaseURL: secrets.databaseURL,
      serviceAccount: secrets.serviceCredentialsPath,
    });
  },

  write: () => {
    const db = firebase.database();
    const ref = db.ref('/');
    const usersRef = ref.child('users');
    usersRef.set({
      alanisawesome: {
        date_of_birth: 'June 23, 1912',
        full_name: 'Alan Turing',
      },
      gracehop: {
        date_of_birth: 'December 9, 1906',
        full_name: 'Grace Hopper',
      },
    });
  },
};
