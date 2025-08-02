import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Ensure base directories exist
export const ensureDirectoriesExist = () => {
  const basePaths = ['uploads/allPhotos', 'uploads/albums'];
  basePaths.forEach(dir => fs.mkdirSync(dir, { recursive: true }));
};
ensureDirectoriesExist();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const album = req.body.album?.trim();
    const savePath = album ? `uploads/albums/${album}` : `uploads/allPhotos`;
    fs.mkdirSync(savePath, { recursive: true });
    cb(null, savePath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({ storage,fileFilter });
// Single Image Upload

export const uploadSingle = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  const caption = req.body.caption || "";
  const captionsFile = path.join('uploads', 'allPhotos', 'captions.json');
  let captionsData = {};

  if (fs.existsSync(captionsFile)) {
    try {
      captionsData = JSON.parse(fs.readFileSync(captionsFile));
    } catch {
      captionsData = {};
    }
  }
  captionsData[req.file.filename] = caption;
  fs.writeFileSync(captionsFile, JSON.stringify(captionsData, null, 2));

  res.status(200).json({
    message: 'Photo uploaded successfully!',
    file: {
      filename: req.file.filename,
      src: `http://localhost:5000/allPhotos/${req.file.filename}`,
      caption: caption
    }
  });
};

// Multiple Image Upload
export const uploadAlbum = (req, res) => {
  const album = req.body.album?.trim();
  if (!album) return res.status(400).json({ message: 'Album name is required.' });
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded.' });

  // Ensure the album directory exists
  const albumDir = path.join('uploads', 'albums', album);
  if (!fs.existsSync(albumDir)) {
    fs.mkdirSync(albumDir, { recursive: true });
  }

  res.status(200).json({
    message: `Photos uploaded successfully to album: ${album}`,
    files: req.files.map(file => ({
      filename: file.filename,
      src: `http://localhost:5000/albums/${album}/${file.filename}`
    }))
  });
};

// Fetch All Photos
export const getAllPhotos = (req, res) => {
  const allPhotosPath = 'uploads/allPhotos/';
  const albumsPath = 'uploads/albums/';
  let allPhotos = [];
  let captionsData = {};

  // Load captions
  const captionsFile = path.join(allPhotosPath, 'captions.json');
  if (fs.existsSync(captionsFile)) {
    try {
      captionsData = JSON.parse(fs.readFileSync(captionsFile));
    } catch {
      captionsData = {};
    }
  }

  // Helper function to load images with timestamp
  function loadDirWithTimestamp(dirRel, webBase, albumName = null) {
  // Use process.cwd() to resolve from project root
  const dir = path.resolve(process.cwd(), dirRel);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
    .map(filename => {
      const full = path.join(dir, filename);
      const stat = fs.statSync(full);
      return {
        filename,
        src: `${webBase}/${filename}`,
        caption: albumName ? albumName : (captionsData[filename] || ""),
        mtimeMs: stat.mtimeMs
      };
    });
}

  // Load standalone photos
  if (fs.existsSync(allPhotosPath)) {
    allPhotos.push(...loadDirWithTimestamp(allPhotosPath, 'http://localhost:5000/allPhotos'));
  }

  // Load album photos
  if (fs.existsSync(albumsPath)) {
    const albums = fs.readdirSync(albumsPath);
    albums.forEach(album => {
      const albumRelPath = path.join(albumsPath, album);
      allPhotos.push(
        ...loadDirWithTimestamp(albumRelPath, `http://localhost:5000/albums/${album}`, album)
      );
    });
  }

  // Sort by most recent
  allPhotos.sort((a, b) => b.mtimeMs - a.mtimeMs);

  res.status(200).json({ photos: allPhotos });
};

// Fetch Albums
export const getAlbums = (req, res) => {
  const albumsPath = 'uploads/albums/';
  if (!fs.existsSync(albumsPath)) return res.status(200).json({ albums: [] });

  const albums = fs.readdirSync(albumsPath).map(album => {
    const albumPath = path.join(albumsPath, album);
    const files = fs.existsSync(albumPath)
      ? fs.readdirSync(albumPath).filter(file => /\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(file))
      : [];
    
    return {
      albumName: album,
      totalPhotos: files.length,
      coverImage: files.length > 0 ? `http://localhost:5000/albums/${album}/${files[0]}` : '/placeholder.svg'
    };
  });

  res.status(200).json({ albums });
};

// Fetch Photos from an Album
export const getAlbumPhotos = (req, res) => {
  const albumName = req.params.albumName;
  const albumPath = `uploads/albums/${albumName}/`;

  if (!fs.existsSync(albumPath)) return res.status(404).json({ message: 'Album not found' });

  const photos = fs.readdirSync(albumPath)
    .filter(file => /\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(file))
    .map(file => ({
      filename: file,
      src: `http://localhost:5000/albums/${albumName}/${file}`
    }));

  res.status(200).json({ album: albumName, photos });
};

// Delete a Photo and remove empty album folder if needed
export const deletePhoto = (req, res) => {
  const { filename, album } = req.body;
  let filePath;
  let responseMessage = 'Photo deleted successfully.';

  if (album && album.trim() !== "") {
    // Photo is part of an album
    filePath = path.join('uploads', 'albums', album, filename);
  } else {
    // Photo is in allPhotos
    filePath = path.join('uploads', 'allPhotos', filename);

    // Remove caption from captions.json
    const captionsFile = path.join('uploads', 'allPhotos', 'captions.json');
    if (fs.existsSync(captionsFile)) {
      try {
        let captionsData = JSON.parse(fs.readFileSync(captionsFile));
        if (captionsData[filename]) {
          delete captionsData[filename];
          fs.writeFileSync(captionsFile, JSON.stringify(captionsData, null, 2));
        }
      } catch (err) {
        console.error("Error updating captions file:", err);
      }
    }
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);

    // If photo was in an album, check if the album folder is now empty
    if (album && album.trim() !== "") {
      const albumDir = path.join('uploads', 'albums', album);
      if (fs.existsSync(albumDir)) {
        const remainingFiles = fs.readdirSync(albumDir).filter(file => /\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(file));
        if (remainingFiles.length === 0) {
          fs.rmdirSync(albumDir, { recursive: true });
          responseMessage += ' Album deleted as it is empty.';
        }
      }
    }

    res.status(200).json({ message: responseMessage });
  } else {
    res.status(404).json({ message: 'File not found.' });
  }
};




