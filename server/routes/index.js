const express = require('express');
const app = express();


app.use( require('./user') );
app.use( require('./auth') );
app.use( require('./Category') );
app.use( require('./book') );
app.use( require('./subcategory') );
app.use( require('./author') );
app.use( require('./feedback') );
app.use( require('./upload') );
app.use( require('./languaje') );
app.use( require('./publisher') );
//app.use( require('./sms') );
app.use( require('./question') );
app.use( require('./comment') );
app.use( require('./wishlist') );
app.use( require('./logging') );
app.use( require('./payment') );
app.use( require('./userBooks') );
app.use( require('./bookRequest') );


module.exports = app;
