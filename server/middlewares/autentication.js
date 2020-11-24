// Verificar token
// ===========================

let verificaToken = (req, res, next) => {
    // obtener header personalizados
    let token = req.get('token');
    
    
    jwt.verify(token, process.env.SEED, (err, decoded) => {
    
        if(err){
            return res.status(401).json({
                status: false,
                message: "Token no válido"
            })
        }

        req.usuario = decoded.usuario;
        next();
    })       
}



export default {
    verificaToken,    
}