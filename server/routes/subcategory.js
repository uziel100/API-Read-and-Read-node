const express = require("express");
const _ = require("underscore");
const app = express();

const Subcategory = require("../models/Subcategory");
const { checkToken, isAdmin } = require("../middlewares/autentication");

app.get("/subcategory", (req, res) => {
  Subcategory.find()
    .populate("category", "_id name niceName")
    .exec((err, subcategories) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Ha ocurrido un error",
        });
      }

      res.json({
        status: true,
        subcategories,
      });
    });
});

app.get("/subcategory/:name", (req, res) => {
  const niceName = req.params.name;
  Subcategory.findOne({ niceName })
    .populate("category", "_id name niceName")
    .exec((err, subcategory) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Ha ocurrido un error",
        });
      }

      if (!subcategory) {
        return res.status(404).json({
          status: false,
          message: "La categoria no existe",
        });
      }


      const idCategory = subcategory.category._id;

      Subcategory.find({ category: idCategory })
      .exec( (err, subcategories) => {
        if (err) {
            return res.status(500).json({
              status: false,
              message: "Ha ocurrido un error",
            });
          }


          res.json({
            status: true,
            subcategory,
            subcategories
          });
      })

    });
});

app.post("/subcategory", [checkToken, isAdmin], (req, res) => {
  const { name, niceName, category } = req.body;

  const newSubcategory = new Subcategory({ name, niceName, category });

  newSubcategory.save((err, subcategory) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Ha ocurrido un error al crear la subcategoria",
      });
    }

    return res.status(201).json({
      status: true,
      subcategory,
    });
  });
});

app.put("/subcategory/:id", [checkToken, isAdmin], (req, res) => {
  const idSubcategory = req.params.id;

  const body = _.pick(req.body, ["name", "niceName", "category"]);

  Subcategory.findByIdAndUpdate(
    idSubcategory,
    body,
    { new: true, runValidators: true },
    (err, subcategory) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message:
            "Ocurrio algún error en el servidor o la subcategoria ya existe",
        });
      }

      return res.status(201).json({
        status: true,
        subcategory,
      });
    }
  );
});

module.exports = app;
