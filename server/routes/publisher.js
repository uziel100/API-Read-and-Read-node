const express = require("express");
const Publisher = require("../models/Publisher");
const app = express();

app.get("/publisher", (req, res) => {
  Publisher.find((err, publishers) => {
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
      return res.json({
        status: false,
        message: "Ha ocurrido un error en el servidor",
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

module.exports = app;
