const Cryptr = require('cryptr');
const cryptr = new Cryptr('secret');

class Encrytion{
    
    encrypt(textPlain){
        return cryptr.encrypt( textPlain );
    }

    decrypt(textEncrypt){        
        return cryptr.decrypt( textEncrypt );
    };
}



module.exports = Encrytion;