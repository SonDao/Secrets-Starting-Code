require('dotenv').config()
const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();
const port = 3000;


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });


const User = mongoose.model('User', userSchema);



app.route("/")
  .get(function(req, res) {
    res.render("home");
  });

app.route("/login")
  .post(function(req, res) {
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({email: userName}, function(err, foundUser) {
      if(err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        } else {
          res.send("incorrect username or password or both! asshole")
        }
      }
    })
  })
  .get(function(req, res) {
    res.render("login");
  });

app.route("/register")
  .post(function(req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });

  })
  .get(function(req, res) {
    res.render("register");
  });





app.listen(port, function() {
  console.log("server is listening at port " + port);
});
