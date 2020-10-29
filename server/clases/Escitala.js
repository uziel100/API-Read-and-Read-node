const replaceSpaceWhiteWithCharacter = text => text.replace(/ /gi, "&").trim();
const replaceCharacterWithSpaceWhite =  text  => text.replace(/&/gi, " ").trim();

module.exports = class Escitala {
  constructor(rows) {
    this.rows = rows;
    this.cols = 0;  
    this.characterReplace = "&"  
  }

  decodingMessage(message) {
    const lettersList = [...message];
    const serie = this.numberMessage(lettersList);
    const msg = this.decoded(serie);

    return replaceCharacterWithSpaceWhite( msg );
  }

  numberMessage(msg) {
    const tam = msg.length;
    let contador = 0;
    let serie = [];
    for (let i = 0; i < tam; i++) {
      if (contador > this.rows - 1) contador = 0;

      serie.push({ value: contador, letter: msg[i] });
      contador++;
    }
    return serie;
  }

  decoded(serie) {
    let messageDecoded = "";    

    for (let i = 0; i <= this.rows; i++) {
      serie.forEach((item) => {
        if (item.value === i) {
          messageDecoded += item.letter;
        }
      });
    }    

    return replaceSpaceWhiteWithCharacter( messageDecoded )
  }
  

  encodingMessage(msg) {
    const matriz = this.transformMatriz(msg);
    const encodedMsg = this.encoding(matriz);
    return replaceSpaceWhiteWithCharacter( encodedMsg );
  }

  transformMatriz(msg) {
    // calcular nuemero de columnas
    this.cols =  Math.trunc( msg.length / this.rows );

    if( (msg.length % this.rows) !== 0 ){    
        this.cols +=  1;
    }    

    let msgSplit = [...msg];
    let pos = 0;
    let matriz = [],
      fila = [];
    for (let row = 0; row < this.rows; row++) {
      fila = [];
      for (let col = 0; col < this.cols; col++) {
        fila.push(pos < msgSplit.length ? msgSplit[pos] : this.characterReplace );
        pos++;
      }
      matriz.push(fila);
    }    
    return matriz;
  }

  encoding(matriz) {
    let msg = "";
    for (let col = 0; col < matriz[0].length; col++) {
      for (let row = 0; row < matriz.length; row++) {
        msg += matriz[row][col];
      }
    }
    return msg;
  }
}


