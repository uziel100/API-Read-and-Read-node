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

// ========================
// CLIENT ID GOOGLE
// ========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '451024139586-ngq240pmq03op37iro4o8d73o64g641f.apps.googleusercontent.com'


// ==================
// AWS credentials - bucket
// ==================
process.env.S3_BUCKET = "read-and-read-bck"
process.env.S3region = 'us-east-1'
process.env.S3accessKeyId = "AKIAJ6YJUVAKRS6EVZSQ"
process.env.S3secretAccessKey = "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"

// ==================
// SMS - TWILIO
// ==================

process.env.serviceID = "VA0dd0f7669019ded347005cd1b6a747f2"
process.env.accountSID = "ACd5fa47c2c5e9fa4b9a035494cbd42209"
process.env.authToken = "1b2e0b069b04c1a89d90166ca7797df3"