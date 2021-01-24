
const express = require('express');
const bodyParse = require('body-parser');
const path = require('path');

const app = express();

// body parse
app.use( bodyParse.urlencoded({ extended: false }) );
app.use( bodyParse.json() )

// Enable file public
app.use( express.static( path.resolve(__dirname, "../public")) )

// Configurar cabeceras y cors -- permitir acceso a peticiones de cualquier front
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});


// Config global routes
app.use('/api/v1/', require('./routes/index') );



module.exports = app;