// =======================================
// PORT
// =======================================

process.env.PORT = process.env.PORT || 8080


// =======================================
// Enviroment
// =======================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =======================================
// DBA
// =======================================
let urlDb = process.env.DB;

if(process.env.NODE_ENV === 'dev'){
    urlDb = "mongodb://localhost:27017/Read&Read"
}
process.env.urlDB = urlDb

// =======================================
// CODIGO PARA LA ESCITALA
// =======================================

process.env.CLAVE = 4;

