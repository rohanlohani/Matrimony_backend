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

const createAlbum = async (req, res) => {
  try {
    // ✅ If a file was uploaded, multer puts its info in req.file
    const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const { album_title, album_description, event_date } = req.body;

    if (!album_title || !album_description || !event_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAlbum = await GalleryAlbums.create({
      album_title,
      album_description,
      cover_image_url: coverImageUrl,
      event_date,
    });

    res.status(201).json({
      message: "Album created successfully",
      album: newAlbum,
    });
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ message: "Failed to create album", error });
  }
};

// Update album

const updateAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;
    const album = await GalleryAlbums.findByPk(albumId);

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Safely extract fields from req.body
    const { album_title, album_description, event_date } = req.body;

    // Prepare updated fields
    const updatedFields = {
      album_title: album_title ?? album.album_title,
      album_description: album_description ?? album.album_description,
      event_date: event_date ?? album.event_date,
    };

    // If a new file is uploaded, replace old cover image
    if (req.file) {
      // Optional: delete old image from disk
      if (album.cover_image_url) {
        const oldPath = path.join(
          __dirname,
          "..",
          "uploads",
          path.basename(album.cover_image_url)
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      updatedFields.cover_image_url = `/uploads/${req.file.filename}`;
    }

    await album.update(updatedFields);

    return res.json({ message: "Album updated successfully", album });
  } catch (error) {
    console.error("Error updating album:", error);
    return res.status(500).json({ message: "Failed to update album" });
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

const getAlbumImages = async (req, res) => {
  try {
    const images = await GalleryImages.findAll({
      where: { album_id: req.params.id },
    });

    if (!images || images.length === 0) {
      return res
        .status(404)
        .json({ message: "No images found for this album" });
    }

    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Failed to fetch images" });
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
  getAlbumImages,
};
