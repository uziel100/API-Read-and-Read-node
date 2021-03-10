
module.exports = class Regex{
    isOnlyLetters(){
        return /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;
    }    
    isOnlyText(){
        return /^[!¡?¿,.A-ZÀ-ÿa-z0-9\s\u00f1\u00d1]+$/;
    }

    isStrongPassword(){
       return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&,.-_;(){}¡<>])([A-Za-z\d$@$!%*?&,.-_;(){}¡<>]|[^ ]){8,15}$/ 
    }

    isDate(){
        return /^\d{4}([\-/.])(0?[1-9]|1[1-2])\1(3[01]|[12][0-9]|0?[1-9])$/
    }    

    isValidObjectId(){
        return /^[0-9a-fA-F]{24}$/;
    }

    
}