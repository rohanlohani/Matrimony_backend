const express = require("express");
const router = express.Router();
const classifiedController = require("../controllers/classifiedController");
const upload = require("../middlewares/uploadMiddleware");
const {
  validateClassified,
  validateClassifiedUpdate,
} = require("../middlewares/classifiedValidation");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

// User API
router.post(
  "/register",
  upload.fields([{ name: "photos", maxCount: 5 }]),
  validateClassified,
  classifiedController.registerListing
);

router.get("/status/:contact", classifiedController.getStatus);
router.get("/search", classifiedController.searchListings);

router.get("/", classifiedController.fetchAllListings);                            // Before /:id
router.get("/:id", classifiedController.getListingById);                          // Dynamic route

// Admin API (protected)

router.get(
  "/pending",
  authenticateAdmin,
  classifiedController.getPendingListings
);
router.put(
  "/:id/approve",
  authenticateAdmin,
  classifiedController.approveListing
);
router.put(
  "/:id/disapprove",
  authenticateAdmin,
  classifiedController.disapproveListing
);

// Route to update listing (allow photo uploads)

router.put(
  "/:id",
  upload.fields([{ name: "photos", maxCount: 5 }]),
  classifiedController.updateListing
);

// Delete listing by id
router.delete("/:id", classifiedController.deleteListing);


module.exports = router;
