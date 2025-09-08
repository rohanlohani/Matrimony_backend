const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware"); // <-- Multer setup

const {
  getSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
} = require("../controllers/homePageSliderController");

router.get("/", getSliders);
router.get("/:id", getSliderById);
router.post("/", upload.single("image_path"), createSlider);
router.put("/:id", upload.single("image_path"), updateSlider);
router.delete("/:id", deleteSlider);

module.exports = router;
