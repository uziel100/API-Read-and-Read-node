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


// =======================================
// CODIGO PARA LA ESCITALA
// =======================================

process.env.CLAVE = 4;


let urlDb = "mongodb+srv://uziel:fV9JzEXgPoFC8ED9@cluster0-68b3h.mongodb.net/Read&Read?retryWrites=true&w=majority";

if(process.env.NODE_ENV === 'dev'){
    urlDb = "mongodb://localhost:27017/Read&Read"
}

process.env.urlDB = urlDb