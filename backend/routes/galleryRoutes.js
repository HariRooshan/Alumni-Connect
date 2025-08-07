const express = require('express');
const {
  uploadSingle,
  uploadAlbum,
  getAllPhotos,
  getAlbums,
  getAlbumPhotos,
  deletePhoto,
  validatePhoto,
  validateBulk,
  deleteUnvalidated,
  deleteAlbum,
  upload,
  sendUploadNotification
} = require('../controllers/galleryController');

const router = express.Router();

router.post('/uploadSingle', upload.single('photo'),    uploadSingle);
router.post('/uploadAlbum',  upload.array('photos',10), uploadAlbum);
router.post("/upload-notification", sendUploadNotification);

router.get('/photos',    getAllPhotos);
router.get('/albums',    getAlbums);
router.get('/album/:albumName', getAlbumPhotos);

router.delete('/photo',  deletePhoto);
router.patch('/validate/:id', validatePhoto);
router.post('/validate', validatePhoto);
router.post('/validate-bulk', validateBulk);
router.delete("/delete-unvalidated", deleteUnvalidated);
router.delete('/album/:albumName', deleteAlbum); 

module.exports = router;
