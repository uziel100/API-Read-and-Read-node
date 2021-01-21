const express = require('express');
const app = express();


app.use( require('./user') );
app.use( require('./auth') );
app.use( require('./Category') );
app.use( require('./Book') );
app.use( require('./subcategory') );

module.exports = app;