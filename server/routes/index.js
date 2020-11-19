const express = require('express');
const app = express();

app.use( require('./prueba') );
app.use( require('./user') )
app.use( require('./login') )


module.exports = app;