const express = require('express');
const app = express(); 

app.get('/prueba', (req, res) => {
    res.json({
        name: 'uziel ',
        desc: 'hELLOO WORLD',
        params: req.params,
    })
})

app.all('/secret', function (req, res, next) {
    console.log('Accessing the secret section ...')
    // next() // pass control to the next handler
  })


module.exports = app;