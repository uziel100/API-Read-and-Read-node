require("./config/index");
const app = require("./app");
const mongoose = require("mongoose");

console.log(typeof process.env.accountSID )
 
mongoose.connect(
  process.env.urlDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  (err, res) => {
    if (err) throw err;

    console.log("Base de datos online!!!");    
    app.listen(process.env.PORT, () => {
      console.log("Escuchando en el puerto: ", process.env.PORT);
    });
    
  }
);
