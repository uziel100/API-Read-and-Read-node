const express = require('express');
const {  checkToken, isUser  } = require('../middlewares/autentication')

const UserBook = require('../models/UserBook')

const app = express();
app.get("/user/book/:idBook",  (req, res) => {
    const id = req.params?.idBook;
    
    UserBook.find({ book: id })
    .populate("book", "_id imgUrl title fileName")
    .exec((err, book) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Ha ocurrido un error en el servidor',
        });
      }
      
      if(!book.length){
        return res.json({
            status: false,
            hasBook: false,
            message: 'No tienes este libro'            
        })
      }

      console.log( book )

      res.json({
        status: true,
        hasBook: true,
        book
      })
    });
});

app.get("/user/:id/book", (req, res) => {
    const id = req.params?.id;
    const limit = Number(req.query.limit);

    if(limit){
      UserBook.find({ user: id }, '_id createdAt')
      .populate("book", "_id imgUrl title fileName")
      .sort({ createdAt: -1 })
      .limit(limit)      
      .exec((err, books) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: 'Ha ocurrido un error en el servidor',
          });
        }
  
        res.json({
          status: true,
          books
        })
      });
    }else{
      UserBook.find({ user: id }, '_id createdAt')
      .populate("book", "_id imgUrl title fileName createdAt")      
      .sort({ createdAt: -1 })
      .exec((err, books) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: 'Ha ocurrido un error en el servidor',
          });
        }
  
        res.json({
          status: true,
          books
        })
      });
    }
});



module.exports = app;
