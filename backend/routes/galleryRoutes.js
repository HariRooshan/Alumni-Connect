const express = require('express');
const { uploadSingle, uploadAlbum, getAllPhotos, getAlbums, getAlbumPhotos, deletePhoto, upload } = require('../controllers/galleryController');

const router = express.Router();

router.post('/uploadSingle', upload.single('photo'), uploadSingle);
router.post('/uploadAlbum', upload.array('photos', 10), uploadAlbum);
router.get('/photos', getAllPhotos);
router.get('/albums', getAlbums);
router.get('/album/:albumName', getAlbumPhotos);
router.delete('/photo', deletePhoto);

module.exports = router;
