// backend/controllers/galleryController.js
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import GalleryPhoto from '../models/GalleryPhoto.js';
import transporter from "../config/transporter.js";
import User2 from "../models/User_main.js";

// ensure folders
export const ensureDirectoriesExist = () => {
  ['uploads/allPhotos', 'uploads/albums'].forEach(dir =>
    fs.mkdirSync(dir, { recursive: true })
  );
};
ensureDirectoriesExist();

// multer config
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
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images allowed"), false);
};
export const upload = multer({ storage, fileFilter });

// ─── Single Upload ───
export const uploadSingle = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  // save caption.json
  const captionsFile = path.join('uploads', 'allPhotos', 'captions.json');
  let captions = {};
  if (fs.existsSync(captionsFile)) {
    try { captions = JSON.parse(fs.readFileSync(captionsFile)); }
    catch { }
  }
  captions[req.file.filename] = req.body.caption || "";
  fs.writeFileSync(captionsFile, JSON.stringify(captions, null, 2));

  // record in Mongo
  await new GalleryPhoto({
    filename: req.file.filename,
    caption: req.body.caption || "",
    album: null,
    validated: req.body.validated === "true"
  }).save();

  res.json({
    message: 'Uploaded & recorded!',
    file: {
      filename: req.file.filename,
      src: `/allPhotos/${req.file.filename}`,
      caption: req.body.caption || ""
    }
  });
};

// ─── Album Upload ───
export const uploadAlbum = async (req, res) => {
  const album = req.body.album?.trim();
  if (!album) return res.status(400).json({ message: 'Album required.' });
  if (!req.files?.length) return res.status(400).json({ message: 'No files.' });
  const exists = await GalleryPhoto.exists({ album });
  if (exists) {
    return res.status(409).json({ message: 'Album already exists' });
  }

  // record each
  const docs = req.files.map(f => ({
    filename: f.filename,
    album,
    caption: "",
    validated: req.body.validated === "true"
  }));
  await GalleryPhoto.insertMany(docs);

  res.json({ message: `Saved ${docs.length} to "${album}"` });
};

// ─── Fetch All Photos ───
export const getAllPhotos = async (req, res) => {
  // optional filter by validated
  const filter = {};
  if (req.query.validated === "true") filter.validated = true;
  if (req.query.validated === "false") filter.validated = false;

  const photos = await GalleryPhoto.find(filter).sort({ uploadedAt: -1 });
  res.json({
    photos: photos.map(p => ({
      _id: p._id,
      filename: p.filename,
      caption: p.caption,
      album: p.album,
      validated: p.validated,
      uploadedAt: p.uploadedAt,
      src: p.album
        ? `/albums/${p.album}/${p.filename}`
        : `/allPhotos/${p.filename}`
    }))
  });
};

// ─── Fetch Albums ───
export const getAlbums = async (req, res) => {
  const agg = await GalleryPhoto.aggregate([
    { $match: { album: { $ne: null } } },
    { $group: { _id: "$album", count: { $sum: 1 }, first: { $first: "$filename" } } }
  ]);
  res.json({
    albums: agg.map(a => ({
      albumName: a._id,
      totalPhotos: a.count,
      coverImage: `/albums/${a._id}/${a.first}`
    }))
  });
};

// ─── Fetch One Album ───
export const getAlbumPhotos = async (req, res) => {
  const photos = await GalleryPhoto.find({ album: req.params.albumName })
    .sort({ uploadedAt: -1 });
  res.json({
    album: req.params.albumName,
    photos: photos.map(p => ({
      _id: p._id,
      filename: p.filename,
      caption: p.caption,
      validated: p.validated,
      uploadedAt: p.uploadedAt,
      src: `/albums/${p.album}/${p.filename}`
    }))
  });
};

// ─── Delete ───
export const deletePhoto = async (req, res) => {
  const { filename, album } = req.body;
  const folder = album ? `uploads/albums/${album}` : `uploads/allPhotos`;
  const filePath = path.join(folder, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await GalleryPhoto.findOneAndDelete({ filename, album: album || null });
  res.json({ message: 'Deleted from disk & DB.' });
};

// ─── Validate Toggle ───
export const validatePhoto = async (req, res) => {
  const p = await GalleryPhoto.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  p.validated = true;
  await p.save();
  res.json({ message: 'Validated', id: p._id });
};
export const validateBulk = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No IDs provided." });
  }
  try {
    await GalleryPhoto.updateMany(
      { _id: { $in: ids } },
      { $set: { validated: true } }
    );
    res.json({ message: "Bulk validated", ids });
  } catch (err) {
    res.status(500).json({ message: "Bulk validation failed", error: err.message });
  }
};
export const deleteUnvalidated = async (req, res) => {
  try {
    const deleted = await GalleryPhoto.deleteMany({ validated: false });
    res.status(200).json({ message: "Deleted unvalidated photos", deletedCount: deleted.deletedCount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const deleteAlbum = async (req, res) => {
  const albumName = req.params.albumName;
  const folder = path.join('uploads', 'albums', albumName);

  // 1) remove files on disk
  if (fs.existsSync(folder)) {
    fs.readdirSync(folder)
      .filter(f => /\.(png|jpe?g|gif|bmp|svg)$/i.test(f))
      .forEach(f => fs.unlinkSync(path.join(folder, f)));
    // remove the directory itself
    fs.rmdirSync(folder, { recursive: true });
  }

  // 2) remove DB entries
  const result = await GalleryPhoto.deleteMany({ album: albumName });

  // 3) respond
  res.json({
    message: `Deleted album "${albumName}" (${result.deletedCount} photos)`,
    deletedCount: result.deletedCount
  });
};
export const sendUploadNotification = async (req, res) => {
  const { name, email, count, album } = req.body;
  if (!name || !email || !count) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  let adminUsers;
  try {
    adminUsers = await User2.find({ role: "Admin" }).select("email -_id");
  } catch (err) {
    console.error("Error fetching admins:", err);
    return res.status(500).json({ message: "Server error" });
  }
  const toAddresses = adminUsers.map(u => u.email).join(",");

  if (!toAddresses) {
    return res.status(400).json({ message: "No admin recipients found." });
  }

  const subject = `New upload by ${name}`;
  let text = `${name} (${email}) has just uploaded ${count} image${count > 1 ? "s" : ""}.`;
  if (album) text += `\nAlbum: "${album}".`;
  text += "\n\nPlease review them at your earliest convenience.";

  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: process.env.BALAMURUGAN_EMAIL,
          to: toAddresses,
          subject,
          text,
        },
        (err, info) => (err ? reject(err) : resolve(info))
      );
    });
    res.status(200).json({ message: "Notification sent to all admins." });
  } catch (err) {
    console.error("Mailer error:", err);
    res.status(500).json({ message: "Could not send notification" });
  }
};