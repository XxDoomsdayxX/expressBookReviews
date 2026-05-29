const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/async', async function (req, res) {  
    try {    
        const bookList = await getBookListAsync('http://localhost:5000/');
    } catch (error) {    
        console.error(error);    
        res.status(500).json({ message: "Error retrieving book list" });  
    }}); 


// Get book details based on ISBN
public_users.get('/async/isbn/:isbn', async function (req, res) {  
    try {    const requestedIsbn = req.params.isbn;    
            const book = await getBookListAsync("http://localhost:5000/isbn/" + requestedIsbn);    
            res.json(book);  
        } catch (error) {    
            console.error(error);    
            res.status(500).json({ message: "Error retrieving book details" });  
        }});


// Get book details based on author
public_users.get('/async/author/:author', async function (req, res) {  
    try {    const requestedAuthor = req.params.author;    
            const book = await getBookListAsync("http://localhost:5000/author/" + requestedAuthor);    
            res.json(book);  
        } catch (error) {    
            console.error(error);    
            res.status(500).json({ message: "Error retrieving book details" });  
        }});


// Get all books based on title
public_users.get('/async/title/:title', async function (req, res) {  
    try {    
        const requestedTitle = req.params.title;    
        const book = await getBookListAsync("http://localhost:5000/title/" + requestedTitle);    
        res.json(book);  
    } catch (error) {    
        console.error(error);    
        res.status(500).json({ message: "Error retrieving book details" });  
    }});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ---------- Tasks 10-13: Async-Await with Axios ----------

// Task 10: Get all books using async-await
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book by ISBN using async-await
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// Task 12: Get books by author using async-await
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Task 13: Get books by title using async-await
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

module.exports.general = public_users;