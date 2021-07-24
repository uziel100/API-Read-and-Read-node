const express = require("express");
const { checkToken, isUser } = require("../middlewares/autentication");

const UserBook = require("../models/UserBook");

const app = express();
app.get("/user/:idUser/book/:idBook", (req, res) => {
    const { idBook, idUser } = req.params;

    UserBook.findOne({ book: idBook, user: idUser })
        .populate("book", "_id imgUrl title fileName")
        .exec((err, book) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Ha ocurrido un error en el servidor",
                });
            }

            if (!book) {
                return res.json({
                    status: false,
                    hasBook: false,
                    message: "No tienes este libro",
                });
            }            

            res.json({
                status: true,
                hasBook: true,                
            });
        });
});

app.get("/user/book/:id", (req, res) => {
    const { id } = req.params;

    UserBook.findById( id )
        .populate("book", "_id imgUrl title fileName")
        .exec((err, book) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Ha ocurrido un error en el servidor",
                });
            }

            if (!book) {
                return res.json({
                    status: false,
                    hasBook: false,
                    message: "No tienes este libro",
                });
            }

            res.json({
                status: true,                
                book,
            });
        });
});

app.put('/user/book/:id', async (req, res) => {
    const { id } = req.params;
    const { currentPage } = req.body;
    try {
        await UserBook.findByIdAndUpdate( id, { currentPage } );
        res.json({
            status: true,
            message: 'Pagina actualizada'
        })
    } catch (error) {
        res.json({
            status: false,
            message: 'Ha ocurrido un error'
        })
    }
})

app.get("/user/:id/book", [checkToken, isUser] ,(req, res) => {
    const id = req.params?.id;
    const limit = Number(req.query.limit);

    if (limit) {
        UserBook.find({ user: id }, "_id createdAt favorite")
            .populate("book", "_id imgUrl title fileName")
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec((err, books) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: "Ha ocurrido un error en el servidor",
                    });
                }

                res.json({
                    status: true,
                    books,
                });
            });
    } else {
        UserBook.find({ user: id }, "_id createdAt favorite")
            .populate("book", "_id imgUrl title fileName createdAt")
            .sort({ createdAt: -1 })
            .exec((err, books) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: "Ha ocurrido un error en el servidor",
                    });
                }

                res.json({
                    status: true,
                    books,
                });
            });
    }
});

app.put("/user-book/favorite", [checkToken, isUser] , async (req, res) => {
    const { id, isFavorite } = req.body;

    try {
        const book = await UserBook.findByIdAndUpdate(id, {
            favorite: isFavorite,
        });
        res.json({
            status: true,
            message: "Libro actualizado",
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Ha ocurrido un error",
            error,
        });
    }
});

app.get("/user-favorite/:idUser", [checkToken, isUser] , async (req, res) => {
    const { idUser } = req.params;
    
    try {
        const books = await UserBook.find(
            { user: idUser, favorite: true },
            "_id createdAt favorite"
        )
            .populate("book", "_id imgUrl title fileName")
            .sort({ updateAt: -1 });

        res.json({
            books,
            status: true,
        });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Ha ocurrido un error',
        error
      })
    }
});

module.exports = app;
