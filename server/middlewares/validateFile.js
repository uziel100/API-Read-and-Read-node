const typesImgAllow = ["png", "jpg", "jpeg"];
const typesFilesAllow = ["pdf"];
const typesCollectionsAllow = ["avatar", "imageBook", "fileBook"];

const validTypeCollection = (req, res, next) => {
  const { type } = req.params;

  if (typesCollectionsAllow.includes(type)) {
    next();
  } else {
    return res.status(400).json({
      status: false,
      message:
        "El tipo no es valido, permitos: " + typesCollectionsAllow.join(", "),
    });
  }
};

const checkIfThereIsFile = (req, res, next) => {
  if (!req.files) {
    return res.status(400).json({
      status: false,
      message: "No hay ningun archivo para subir",
    });
  } else {
    next();
  }
};

const validTypeFile = (req, res, next) => {
  let { id, type } = req.params;
  let file = req.files.file;

  const nameSplit = file.name.split(".");
  const fileType = nameSplit[nameSplit.length - 1];
  const fileName = `${ id }-${ new Date().getMilliseconds() }.${ fileType }`        

  if(type === 'avatar' || type === 'imageBook'){
    if (typesImgAllow.includes(fileType)) {
      req.fileName = fileName;
      req.fileType = fileType;
      next();
    } else {
      return res.status(400).json({
        status: false,
        message: "Las extensiones permitidas son: " + typesImgAllow.join(", "),
        ext: fileType,
      });
    }
  }else{
    if (typesFilesAllow.includes(fileType)) {
      req.fileName = fileName;
      req.fileType = fileType;
      next();
    } else {
      return res.status(400).json({
        status: false,
        message: "Las extensiones permitidas son: " + typesFilesAllow.join(", "),
        ext: fileType,
      });
    }
  }
};


module.exports = {
    validTypeCollection,
    checkIfThereIsFile,
    validTypeFile,
}