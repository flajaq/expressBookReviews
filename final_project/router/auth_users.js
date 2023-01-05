const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    for(let i=0; i < users.length; i++) {
        if(username == users[i].username) {
            return false;
        }
    }
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    for(let i = 0; i < users.length; i++) {
        if(username == users[i].username && password ==users[i].password) {
            return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if(!req.query.username || !req.query.password) {
    return res.status(400).json({message: "Missing password and/or username"});
  }
  if(authenticatedUser(req.query.username,req.query.password)) {
    let user = {"username": req.query.username, "password": req.query.password};
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });
    req.session.user = user;
    req.session.authorization = {
        accessToken
    }
    return res.status(200).json({message: "User logged in"});
  }
  if(!isValid(req.query.username) && ! authenticatedUser(req.query.username,req.query.password)) {
    return res.status(400).json({message: "Wrong Password"});
  } else {
      return res.status(400).json({message: "User not registered"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if(!req.query.review) {
      return res.status(400).json({message: "No review submitted"});
  }
  let book = books[req.params.isbn];
  let username = req.session.user["username"];
  let review = req.query.review;//{"user": username, "review": req.query.review};
  let already = false;
  //return res.send(book.reviews)
  for(let i = 0; i < book.reviews; i++) {
      if(book.reviews[i]["username"] == username) {
          book.reviews[i] = review;
          already = true;
      }
  }
  if(!already) {
    book.reviews[username] = review; 
  }
  return res.send("added review")
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
