require("./config/index");
const app = require("./app");
const mongoose = require("mongoose");


mongoose.connect(
  process.env.urlDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) throw err;

    console.log("Base de datos online!!!");
    console.log(process.env.urlDB);
    app.listen(process.env.PORT, () => {
      console.log("Escuchando en el puerto: ", process.env.PORT);
    });
    
  }
);
