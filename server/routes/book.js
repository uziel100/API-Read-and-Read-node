const express = require("express");
const _ = require("underscore");
const { checkToken, isAdmin } = require("../middlewares/autentication");
const app = express();

const Book = require("../models/Book");

app.get("/test", (req, res) => {
  const params = req.query.author;
  res.json({
    status:true,
    params
  })
});


app.get("/book", (req, res) => {
  Book.find()
    .populate("category", "name niceName")
    .populate("subCategory", "name niceName")
    .populate("languaje", "name")
    .populate({
      path: "author",
      populate: { path: "author" },
    })
    .populate({
      path: "publisher",
      populate: { path: "publisher" },
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

app.get("/book/new", (req, res) => {
  Book.find({}, "_id title price")
    .sort({ _id: -1 })
    .limit(10)
    .exec( (err, books) => {
      if(err){
        return res.status(400).json({
          status: false,
          message: err,
        });
      }

      res.json({
        status: true,
        books,
      });

    })
})

app.get("/book/search/:word", (req, res) => {
  const wordSearch = req.params.word;
  let regex = new RegExp(wordSearch, "i");

  Book.find(
    { $or: [{ title: regex }, { summary: regex }, { ISBN: regex }] },
    "_id title price"
  ).exec((err, books) => {
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

app.get("/book/advanceSearch", (req, res) => {
  const title = req.query.title;
  const idcategory = req.query.category;
  const author = req.query.author;

  if( !(title && idcategory && author) ){
    return res.status(400).json({
      status: false,
      message: 'Hay campos vacios'
    });
  }

  const regexTitle = new RegExp( title, "i");


  Book.find({ $and: [{title: regexTitle}, {subCategory: idcategory}, { author } ]  },
    "_id title price"
  ).exec((err, books) => {
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
      path: "author",
      populate: { path: "author" },
    })
    .populate({
      path: "publisher",
      populate: { path: "publisher" },
    })    
    .exec((err, book) => {
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

app.get("/book/subcategory/:idSubCategory", (req, res) => {
  const subCategory = req.params.idSubCategory;

  Book.find({ subCategory }, "_id title price author imgUrl")
    .populate({ path: "author", populate: { path: "author" } })
    .exec((err, books) => {
      if (err) {
        return res.status(400).json({
          status: false,
          message: err,
        });
      }

      const list = getListAuthor(books);
      const authors = removeDuplicateAuthor( list );

      res.json({
        status: true,
        books,
        authors
      });
    });
});

const getListAuthor = (books) => books.map((book) => book.author).flat();

const removeDuplicateAuthor = (authors) => {
  const names = [];
  const listAuthors = [];
  authors.forEach((author) => {
    if (!names.includes(author.name)) {
      names.push(author.name);
      listAuthors.push(author);
    }
  });

  return listAuthors;
};
// [checkToken, isAdmin]
app.post("/book",  (req, res) => {
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
  ]); 

  const newBook = new Book(booKData);

  newBook.save((err, book) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Ha ocurrido un error al crear la libro",
      });
    }

    res.json({
      status: true,
      message: 'Libro agregado :)',
      book,
    });
  });
});
// [checkToken, isAdmin]
app.put("/book/file/:id",  (req, res) => {
  const { id  } = req.params;
  const bookData = _.pick(req.body, [
    "imgUrl",
    "fileName",
  ]);     
  Book.findByIdAndUpdate(
    id,     
    bookData,
    { new: true, runValidators: true },
    (err, book) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Ha ocurrido un error al actualizar",
      });
    }

    res.json({
      status: true,
      message: 'Actualizado correctamente :)',  
      book
    });
  });
});

module.exports = app;
