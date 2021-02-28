const jwt = require('jsonwebtoken');

// ===========================
// Check Token valid
// ===========================

const checkToken = (req, res, next) => {
    // Get token at custon header     
    let token = req.headers['token'];
    if(!token){        
        return res.status(401).json({
                status: false,
                message: "Necesitas un token"
         })
        
    }
    
    token = token.split(" ")[1]    
        
    jwt.verify(token, process.env.SEED, (err, decoded) => {
    
        if(err){
            return res.status(401).json({
                status: false,
                message: "Token no válido"
            })
        }

        req.user = decoded.user;
        next();
    })       
}

const isAdmin = (req, res, next) => {
    const role = req.user.role;
    const hasRoleAdmin = role === 'ADMIN_ROLE'

    if(!hasRoleAdmin){
        return res.status(401).json({
            status: false,
            message: 'No tienes permisos de administrador'
        });
    }else{
        next();
    }
}



module.exports = {
    checkToken,
    isAdmin    
}