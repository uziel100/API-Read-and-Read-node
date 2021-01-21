const express = require("express");
const app = express();

const Book = require("../models/Book");

app.get("/book", (req, res) => {
  Book.find((err, books) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err,
      });
    }

    res.json({
      status: true,
      books,
    });
  });
});

app.get("/book/:id", (req, res) => {
  const idBook = req.params.id;

  Book.findById(idBook, (err, book) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err,
      });
    }

    res.json({
      status: true,
      book,
    });
  });
});

app.post("/book", (req, res) => {
  const {
    ISBN,
    title,
    summary,
    lang,
    numPages,
    sizeFile,
    price,
    author,
    publisher,
    category,
    subCategory,
    tags,
  } = req.body;

  const newBook = new Book({
    ISBN,
    title,
    summary,
    lang,
    numPages,
    sizeFile,
    price,
    author,
    publisher,
    category,
    subCategory,
    tags,
  });

  newBook.save((err, book) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Ha ocurrido un error al crear la categoria",
      });
    }

    res.json({
      status: true,
      book
    })
  });
  
});

module.exports = app;
