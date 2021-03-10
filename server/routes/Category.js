const express = require("express");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const { checkToken, isAdmin } = require("../middlewares/autentication");
const _ = require('underscore')

const app = express();

app.get("/category/only", (req, res) => {
  Category.find({}, "_id name niceName")
    .sort({ _id: -1 })
    .exec((err, categories) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Ha ocurrido un error",
        });
      }

      res.json({
        status: true,
        categories,
      });
    });
}); 

app.get("/category", (req, res) => {
  Category.find({}, "_id name niceName")
    .sort({ _id: -1 })
    .exec((err, categories) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Ha ocurrido un error",
        });
      }

      Subcategory.find({}, "_id name niceName category").exec(
        (err, subcategories) => {
          if (err) {
            return res.status(500).json({
              status: false,
              message: "Ha ocurrido un error",
            });
          }
          const mapCategories = categories.map((category) => {
            const subCategoriesInCategoria = subcategories.filter(
              (subcategory) =>
                subcategory.category.toString() == category._id.toString()
            );
            return {
              data: category,
              subcategories: subCategoriesInCategoria,
            };
          });

          res.json({
            status: true,
            categories: mapCategories,
          });
        }
      );
    });
});

app.get("/category/:id", (req, res) => {
  const idCategory = req.params.id;

  Category.findById(idCategory, (err, category) => {
    if (err) {
      return res.status(404).json({
        status: false,
        message: "La categoria no existe",
      });
    }

    res.json({
      status: true,
      category,
    });
  });
});

app.post("/category", [checkToken, isAdmin], (req, res) => {
  const { name, niceName } = req.body;

  const newCategory = new Category({ name, niceName });

  newCategory.save((err, category) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Ha ocurrido un error al crear la categoria",
      });
    }

    res.status(201).json({
      status: true,
      category,
    });
  });
});

app.put("/category/:id", [checkToken, isAdmin], (req, res) => {
  const idcategory = req.params.id;

  const body = _.pick(req.body, ["name", "niceName"]);
	
  Category.findByIdAndUpdate(
    idcategory,
    body,    
    (err, category) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message:
            "Ocurrio algún error en el servidor o la categoria ya no existe",
        });
      }

      return res.json({
        status: true,
        message: 'Actualizado correctamente :)'
      });
    }
  );
});

app.delete("/category/:id", [checkToken, isAdmin], (req, res) => {
  const idcategory = req.params.id;
	
  Category.findByIdAndRemove(
    idcategory,       
    (err) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message:
            "Ocurrio algún error en el servidor o la categoria ya no existe",
        });
      }

      return res.json({
        status: true,
        message: 'Eliminado correctamente :)'
      });
    }
  );
});

module.exports = app;
