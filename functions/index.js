const functions = require('firebase-functions');

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
})

exports.insertIntoDB = functions.https.onRequest((req, res) => {
    const text = req.query.text
    admin.database().ref('/test').push({text: text}).then(snapshot => {
        return res.redirect(303, snapshot.ref)
    }).catch(err => {
        console.log(err)
    })
})

exports.convertToUppercase = functions.database.ref('/test/{pushId}/text').onWrite((change, context) => {
    if (change.before.exists()) {
        return null;
      }
      // Exit when the data is deleted.
      if (!change.after.exists()) {
        return null;
      }
      // Grab the current value of what was written to the Realtime Database.
      const original = change.after.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return change.after.ref.parent.child('uppercase').set(uppercase);
})