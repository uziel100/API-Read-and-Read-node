const express = require("express");
const _ = require('underscore');
const { checkToken, isAdmin } = require("../middlewares/autentication");
const app = express();

const Book = require("../models/Book");


app.get("/book", (req, res) => {
  Book.find()
  .populate("category", "name niceName")
  .populate("subCategory", "name niceName")
  .populate({
    path: 'author',
    populate: { path: 'author' }
  })
  .exec((err, books) => {
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

  Book.findById(idBook)
  .populate("category", "name niceName")
  .populate("subCategory", "name niceName")
  .populate({
    path: 'author',
    populate: { path: 'author' }
  })
  .exec( (err, book) => {
    if (err) {
      return res.status(404).json({
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


app.get("/booksInCategory/:searchByIdSubCategory", (req, res) => {
  const subCategory = req.params.searchByIdSubCategory;

  Book.find({ subCategory }, "_id title price")
  .exec((err, books) => {
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

app.post("/book", [checkToken, isAdmin], (req, res) => {
  const booKData = _.pick(req.body, [
    "ISBN",
    "title",
    "summary",
    "lang",
    "numPages",
    "sizeFile",
    "price",
    "author",
    "publisher",
    "category",
    "subCategory",
  ])
 
  const newBook = new Book( booKData );

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
