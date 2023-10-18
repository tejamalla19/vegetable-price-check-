const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const axios = require('axios');
const bcrypt = require('bcrypt');

var serviceAccount = require("./database.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname));


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.post('/onLogin', function (req, res) {
  res.sendFile(__dirname + '/veg.html');
});

app.get('/signup', function (req, res) {
  res.sendFile(__dirname + '/signup.html');
});


app.post('/onSignup', function (req, res) {
  const data = req.body;
  const email = req.body.email;
  const password = req.body.password; // Assuming you have a password field in your form

  // Hash the password before storing it in the database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      res.render('signup', { message: "An error occurred while signing up." });
      return;
    }

    // Replace the password field with the hashed password
    data.password = hash;

    db.collection('user')
      .where("email", "==", email)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          res.send("error");
        } else {
          db.collection('user')
            .add(data)
            .then(() => {
              res.send("Successfully signed up!");
            })
            .catch(error => {
              console.error("Error adding data:", error);
              res.render('signup', { message: "An error occurred while signing up." });
            });
        }
      })
      .catch(error => {
        console.error("Error adding data:", error);
        res.render('signup', { message: "An error occurred while signing up." });
      });
  });
});
app.get('/getPrices', function (req, res) {
  res.sendFile(__dirname + '/veg1.html');
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
