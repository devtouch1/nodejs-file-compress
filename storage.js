const multer = require('multer'); //to upload the files to the server
const path = require('path');

//create storage/////// define location and file name style
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "public/uploads");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});



//export
module.exports = storage;