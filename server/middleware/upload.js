const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.pdf' && ext !== '.doc' && ext !== '.docx' && ext !== '.png' && ext !== '.jpg') {
      return cb(new Error('Only documents and images are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;