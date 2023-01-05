const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    if(!req.query.username || !req.query.password) {
        return res.status(400).json({message: "Missing password and/or username"});
    } else {        
        if(isValid(req.query.username)) {
            users.push({"username":req.query.username,"password":req.query.password});
            res.send("The user" + (' ')+ (req.query.username) + " Has been added!")
        } else {
            return res.status(400).json({message: "Username already used"});
        }
    }
});

public_users.get("/users", (req,res) => {
    return res.send(JSON.stringify({users},null,4));
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //return res.status(300).json({message: "Yet to be implemented"});
  let book = books[req.params.isbn]
  return res.send(JSON.stringify({book},null,4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;
  const filtered_books = [];
  for (const [key, value] of Object.entries(books)) {
    if(value.author == author) {
        filtered_books.push(key, value);
    }
  }
  return res.send(JSON.stringify({filtered_books},null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const filtered_books = [];
    for (const [key, value] of Object.entries(books)) {
      if(value.title == title) {
          filtered_books.push(key, value);
      }
    }
    return res.send(JSON.stringify({filtered_books},null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  let reviews = book.reviews;
  return res.send(JSON.stringify({reviews},null,4));
});
/*
public_users.get('/', async function (req, res) {
    try {
      const result = await AsyncGetBooks();
      return res.send(JSON.stringify({result},null,4));
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
});
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const result = await AsyncGetBooksByISBN();
      return res.send(JSON.stringify({result},null,4));
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
});
public_users.get('/author/:author', async function (req, res) {
    try {
      const result = await AsyncGetBooksByAuthor();
      return res.send(JSON.stringify({result},null,4));
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
});
public_users.get('/title/:title', async function (req, res) {
    try {
      const result = await AsyncGetBooksByTitle();
      return res.send(JSON.stringify({result},null,4));
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
});
*/
  

module.exports.general = public_users;
