const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware"); // Multer setup

const {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addImagesToAlbum,
  deleteImage,
} = require("../controllers/galleryController");

// --- Album Routes ---
router.get("/albums", getAlbums); // Get all albums
router.get("/albums/:id", getAlbumById); // Get album by ID
router.post("/albums", upload.single("cover_image"), createAlbum); // Create new album
router.put("/albums/:id", updateAlbum); // Update album
router.delete("/albums/:id", deleteAlbum); // Delete album

// --- Images Routes ---
router.post(
  "/albums/:id/images",
  upload.array("images", 10), // accept multiple images, max 10
  addImagesToAlbum
);

router.delete("/images/:id", deleteImage); // Delete single image

module.exports = router;
