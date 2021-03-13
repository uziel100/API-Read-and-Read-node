const express = require("express");
const Publisher = require("../models/Publisher");
const app = express();

app.get("/publisher", (req, res) => {
  Publisher.find({})
   .sort({ _id: -1 })
   .exec((err, publishers) => {
    if (err) {
      return res.json({
        status: false,
        message: "Ha ocurrido un error en el servidor",
      });
    }
    res.json({
      status: true,
      data: publishers,
    });
  });
});

app.post("/publisher", (req, res) => {
  const { name } = req.body;

  const newPublisher = new Publisher({ name });

  newPublisher.save((err) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: "Hay un editorial con el mismo nombre",
      });
    }

    res.json({
      status: true,
      message: "Agregado correctamente",
    });
  });
});

app.put("/publisher/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  Publisher.findByIdAndUpdate(
    id, 
    { name },
    { new: true, runValidators: true },
    (err) => {
      if (err) {
        return res.json({
          status: false,
          message: 'No exise el elemento que quiere actualizar'
        });
      }
    
      res.json({
        status: true,
        message: "Actualizado correctamente :)",
      });
  })
});

app.delete("/publisher/:id", (req, res) => {
  const { id } = req.params;  

  Publisher.findByIdAndRemove(
    id,         
    (err) => {
      if (err) {
        return res.json({
          status: false,
          message: 'No exise el elemento que quiere actualizar'
        });
      }
    
      res.json({
        status: true,
        message: "Eliminado correctamente :)",
      });
  })
});

module.exports = app;
