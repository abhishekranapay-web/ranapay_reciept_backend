const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed =
    file.mimetype.includes('csv') ||
    file.mimetype.includes('sheet') ||
    file.originalname.endsWith('.xlsx');

  if (allowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only CSV and Excel files allowed'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;