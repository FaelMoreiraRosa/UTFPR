const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); 
    },
    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname);
        const nomeUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, nomeUnico + extensao);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;