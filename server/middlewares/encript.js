const Escitala = require('../clases/Escitala');


// =====================================
// Codificar informacion
// =====================================
const encodigData = (req, res, next) => {
    const body = req.body;
    const encript = new Escitala( process.env.CLAVE );
    

    const user  =  {
        name:  encript.encodingMessage( body.name ),
        email: encript.encodingMessage( body.email ),
        password: encript.encodingMessage( body.password ),
        address: encript.encodingMessage( body.address ),
        phone: encript.encodingMessage( body.phone ) ,
        date: encript.encodingMessage( body.date ) ,
        sexo: encript.encodingMessage( body.sexo )
    }

    req.user = user;    

    next();    
}


module.exports = {
    encodigData
}