const express = require("express");
const Languaje = require("../models/Languaje");
const app = express();

app.get("/languaje", (req, res) => {
  Languaje.find((err, languajes) => {
    if (err) {
      return res.json({
        status: false,
        message: "Ha ocurrido un error en el servidor",
      });
    }
    res.json({
      status: true,
      data: languajes,
    });
  });
});

app.post("/languaje", (req, res) => {
  const { name } = req.body;

  const newLanguaje = new Languaje({ name });

  newLanguaje.save((err) => {
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

app.put("/languaje/:id", (req, res) => {
  const { id } = req.params.id;
  const { name } = req.body;

  Languaje.findByIdAndUpdate(
    id, 
    { name },
    { new: true, runValidators: true },
    (err) => {
      if (err) {
        return res.json({
          status: false,
          message: "Ha ocurrido un error en el servidor",
        });
      }
    
      res.json({
        status: true,
        message: "Actualizado correctamente :)",
      });
  })
});

module.exports = app;
