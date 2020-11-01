const express = require('express');
const app = express(); 

app.get('/prueba', (req, res) => {
    res.json({
        name: 'uziel ',
        desc: 'hELLOO WORLD',
        params: req.params,
    })
})



module.exports = app;