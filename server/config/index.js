// =======================================
// PORT
// =======================================

process.env.PORT = process.env.PORT || 8080

// =======================================
// Enviroment
// =======================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================
// Expiration token
// ========================

process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;

// ========================
// SEED of Autentication
// ========================

process.env.SEED = process.env.SEED || 'seed-de-desarrollo'

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

// ========================
// LINK FOR FORGET PASSWORD
// ========================
let  link = ""
if(process.env.NODE_ENV === 'dev'){
    link = "http://localhost:3000/unirse/restablecerPassword"
    
}else{
    link = "https://read-and-read.herokuapp.com/unirse/restablecerPassword"
}

process.env.URL_SITE = link

