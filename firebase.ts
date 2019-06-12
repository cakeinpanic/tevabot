const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: '123456'
});

const db = admin.database();
const messages = db.ref('messages');
const usersDB = db.ref('users');

// messages.set({kek: {lol: 'rrrr'}});

class Database {
    saveUsers(users) {
        usersDB.set(users);
    }

    readUsers() {
        return usersDB.once("value").then((snapshot) => {
            console.log(snapshot.val());
            return JSON.parse(snapshot.val());
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            return [];
        });
    }
}

usersDB.on('child_added', function (snapshot, prevChildKey) {
    // const newPost = snapshot.val();
    // console.log('Author: ' + JSON.parse(newPost));
    // console.log('Previous Post ID: ' + prevChildKey);
});


// usersDB.on("value", function(snapshot) {
//     console.log(snapshot.val());
// }, function (errorObject) {
//     console.log("The read failed: " + errorObject.code);
// });


export  const firebase = new Database();