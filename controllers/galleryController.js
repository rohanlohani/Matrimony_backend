const GalleryAlbums = require("../models/galleryAlbumsModel");
const GalleryImages = require("../models/galleryImagesModel");
const fs = require("fs");
const path = require("path");

// -------------------- Albums --------------------

// Get all albums with images
const getAlbums = async (req, res) => {
  try {
    const albums = await GalleryAlbums.findAll({
      include: [{ model: GalleryImages }],
      order: [["createdAt", "DESC"]],
    });
    res.json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch albums" });
  }
};

// Get single album by ID with images
const getAlbumById = async (req, res) => {
  try {
    const album = await GalleryAlbums.findByPk(req.params.id, {
      include: [{ model: GalleryImages }],
    });
    if (!album) return res.status(404).json({ message: "Album not found" });
    res.json(album);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch album" });
  }
};

// Create new album
const createAlbum = async (req, res) => {
  try {
    const { album_title, album_description, cover_image_url, event_date } =
      req.body;
    const album = await GalleryAlbums.create({
      album_title,
      album_description,
      cover_image_url,
      event_date,
    });
    res.status(201).json(album);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create album" });
  }
};

// Update album
const updateAlbum = async (req, res) => {
  try {
    const album = await GalleryAlbums.findByPk(req.params.id);
    if (!album) return res.status(404).json({ message: "Album not found" });

    const { album_title, album_description, cover_image_url, event_date } =
      req.body;

    await album.update({
      album_title,
      album_description,
      cover_image_url,
      event_date,
    });

    res.json(album);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update album" });
  }
};

// Delete album (and associated images due to CASCADE)
const deleteAlbum = async (req, res) => {
  try {
    const album = await GalleryAlbums.findByPk(req.params.id);
    if (!album) return res.status(404).json({ message: "Album not found" });

    await album.destroy();
    res.json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete album" });
  }
};

// -------------------- Images --------------------

// Add images to album
const addImagesToAlbum = async (req, res) => {
  try {
    const album = await GalleryAlbums.findByPk(req.params.id);
    if (!album) return res.status(404).json({ message: "Album not found" });

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No images uploaded" });

    const imagesData = req.files.map((file) => ({
      album_id: album.album_id,
      image_url: file.path, // or file.location if using S3/Cloudinary
      caption: req.body.caption || null,
    }));

    const images = await GalleryImages.bulkCreate(imagesData);

    res.status(201).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload images" });
  }
};

// Delete single image
const deleteImage = async (req, res) => {
  try {
    const image = await GalleryImages.findByPk(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // Optional: delete image from local storage
    if (image.image_url) {
      const filePath = path.resolve(image.image_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await image.destroy();
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};

module.exports = {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addImagesToAlbum,
  deleteImage,
};
