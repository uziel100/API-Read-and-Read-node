const express = require("express");
const app = express();
const Wishlist = require("../models/Wishlist");

app.get("/wishlist/user/:id", (req, res) => {
  const { id } = req.params;

  Wishlist.find({ userId: id, status: true }, { _id:0, userId: 0 })
    .populate("bookId", "title _id imgUrl price")
    .sort({ _id: -1 })
    .exec((err, list) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Ha ocurrido un error en el servidor",
        });
      }

      res.json({
        status: true,
        data: list,
      });
    });
});

app.post("/wishlist", (req, res) => {
    const { userId, bookId } = req.body;

    Wishlist.find({ userId, bookId }, (err, list) => {
        if (err) {
            return res.status(500).json({
              status: false,
              message: "Ha ocurrido un error en el servidor",
            });
        }
        
        if(list.length > 0){
            return res.status(400).json({
                status: false,
                message: "Ya tienes agregado este libro a tu wishlist",
            });
        }

        const newWishList = new Wishlist({ userId, bookId });

        newWishList.save((err, book) => {

            if (err) {
                return res.status(500).json({
                  status: false,
                  message: "No se ha podido agregar",
                });
            }

            res.json({
                status: true,
                message: 'Libro agregado a tu wishlist :)'
            }); 
        })

    })    
})

module.exports = app;
