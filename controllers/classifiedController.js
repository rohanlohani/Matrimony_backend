const Classified = require("../models/classifiedModel");
const { Op } = require("sequelize");

// Helper to serialize photos array to string
const serializePhotos = (files) => {
  if (!files) return null;
  // Assume photos uploaded under 'photos' field
  const filenames = files.photos ? files.photos.map((f) => f.filename) : [];
  return filenames.join(",");
};

// Helper to deserialize photos string to array
const deserializePhotos = (photosString) => {
  if (!photosString) return [];
  return photosString.split(",");
};

// Create a new classified listing
exports.registerListing = async (req, res) => {
  try {
    const data = req.body;
    data.photos = serializePhotos(req.files);

    const existing = await Classified.findOne({
      where: { [Op.or]: [{ email: data.email }, { phone: data.phone }] },
    });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Email or Phone already registered" });
    }

    const listing = await Classified.create(data);
    res.status(201).json({ message: "Listing registered", listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register listing" });
  }
};

// Get listing approval status by user email or phone
exports.getStatus = async (req, res) => {
  try {
    const { contact } = req.params; // either phone or email for simplicity
    const listing = await Classified.findOne({
      where: { [Op.or]: [{ email: contact }, { phone: contact }] },
      attributes: ["status"],
    });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json({ status: listing.status });
  } catch (err) {
    res.status(500).json({ error: "Error retrieving status" });
  }
};

// Search approved listings with optional filters
exports.searchListings = async (req, res) => {
  try {
    const { business_category, firm_name } = req.query;
    const filters = { status: "approved" };
    if (business_category) filters.business_category = business_category;
    if (firm_name) filters.firm_name = { [Op.like]: `%${firm_name}%` };

    const listings = await Classified.findAll({ where: filters });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Error searching listings" });
  }
};

// Get listing details by id
exports.getListingById = async (req, res) => {
  try {
    const listing = await Classified.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: "Failed to get listing details" });
  }
};

// Admin: Approve a listing
exports.approveListing = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // Fetch current listing
    const listing = await Classified.findByPk(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (listing.status === "approved") {
      return res.status(400).json({ message: "Listing is already approved" });
    }

    // if (listing.status === "disapproved") {
    //   return res
    //     .status(400)
    //     .json({ message: "Cannot approve a disapproved listing" });
    // }

    // Update to approved
    await Classified.update(
      {
        status: "approved",
        approval_by: adminId,
        approval_date: new Date(),
      },
      { where: { id } }
    );

    res.json({ message: "Listing approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve listing" });
  }
};

// Admin: Disapprove a listing
exports.disapproveListing = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // Fetch current listing
    const listing = await Classified.findByPk(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (listing.status === "disapproved") {
      return res
        .status(400)
        .json({ message: "Listing is already disapproved" });
    }

    // if (listing.status === "approved") {
    //   return res
    //     .status(400)
    //     .json({ message: "Cannot disapprove an approved listing" });
    // }

    // Update to disapproved
    await Classified.update(
      {
        status: "disapproved",
        approval_by: adminId,
        approval_date: new Date(),
      },
      { where: { id } }
    );

    res.json({ message: "Listing disapproved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to disapprove listing" });
  }
};

// Admin: List pending listings
exports.getPendingListings = async (req, res) => {
  try {
    const listings = await Classified.findAll({ where: { status: "pending" } });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Failed to get pending listings" });
  }
};

// Update a listing by ID
exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    let data = req.body;

    // Parse deletedPhotos if it's sent as JSON string
    let deletedPhotos = [];
    if (data.deletedPhotos) {
      try {
        deletedPhotos = JSON.parse(data.deletedPhotos);
      } catch (err) {
        console.error("Failed to parse deletedPhotos:", err);
      }
    }

    // Check if the listing exists first
    const listing = await Classified.findByPk(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Get existing photos (array)
    let existingPhotos = listing.photos ? listing.photos.split(",") : [];

    // Step 1: Remove deleted photos from existingPhotos array
    if (deletedPhotos.length > 0) {
      existingPhotos = existingPhotos.filter(
        (photo) => !deletedPhotos.includes(photo)
      );
    }

    // Step 2: Add newly uploaded photos (if any)
    if (req.files && req.files.photos) {
      const newPhotos = req.files.photos.map((f) => f.filename);
      existingPhotos = [...existingPhotos, ...newPhotos];
    }

    // Step 3: Update `photos` field with merged photos
    data.photos = existingPhotos.join(",");

    // Step 4: Update the listing
    await Classified.update(data, { where: { id } });

    // Optional: Delete removed images from the filesystem
    if (deletedPhotos.length > 0) {
      const fs = require("fs");
      const path = require("path");

      deletedPhotos.forEach((photo) => {
        const filePath = path.join(__dirname, "../uploads", photo);
        fs.unlink(filePath, (err) => {
          if (err) console.warn(`Could not delete file: ${photo}`, err);
        });
      });
    }

    // Fetch the latest listing
    const updatedListing = await Classified.findByPk(id);

    res.json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update listing" });
  }
};

// Delete a listing by ID
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("type::id:: ", typeof id);
    const deleted = await Classified.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Listing not found" });

    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete listing" });
  }
};

// Fetch all listings (optionally with filters)
exports.fetchAllListings = async (req, res) => {
  try {
    const listings = await Classified.findAll();
    console.log("listingggg:;: ", listings);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};
