const HomePageSlider = require("../models/homePageSliderModel");
const path = require("path");
const {
  buildSliderImageUrl,
  handleSliderImage,
} = require("../utils/sliderHelpers");

exports.createSlider = async (req, res) => {
  try {
    const sliderData = {
      image_path: req.file ? req.file.filename : null,
      alt_text: req.body.alt_text || null,
    };

    if (!sliderData.image_path) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newSlider = await HomePageSlider.create(sliderData);

    res.status(201).json({
      message: "Slider created successfully",
      slider: {
        ...newSlider.toJSON(),
        image_path: `/uploads/${newSlider.image_path}`,
      },
    });
  } catch (error) {
    console.error("Error creating slider:", error);
    res.status(500).json({ error: "Failed to create slider" });
  }
};

// Get all sliders
exports.getSliders = async (req, res) => {
  try {
    const sliders = await HomePageSlider.findAll({
      order: [["created_at", "DESC"]],
    });
    console.log("sliderssssss: ", sliders);
    const response = sliders.map((s) => ({
      ...s.toJSON(),
      image_path: `/uploads/${s.image_path}`,
    }));
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sliders" });
  }
};

// Get single slider by ID
exports.getSliderById = async (req, res) => {
  try {
    const slider = await HomePageSlider.findByPk(req.params.id);
    if (!slider) return res.status(404).json({ error: "Slider not found" });

    const response = slider.toJSON();
    response.image_path = `/uploads/${response.image_path}`;
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch slider" });
  }
};

// Update slider
exports.updateSlider = async (req, res) => {
  try {
    const slider = await HomePageSlider.findByPk(req.params.id);
    if (!slider) return res.status(404).json({ error: "Slider not found" });

    slider.image_path = req.file ? req.file.filename : slider.image_path;
    slider.alt_text = req.body.alt_text || slider.alt_text;

    await slider.save();

    res.status(200).json({
      message: "Slider updated successfully",
      slider: {
        ...slider.toJSON(),
        image_path: `/uploads/${slider.image_path}`,
      },
    });
  } catch (error) {
    console.error("Error updating slider:", error);
    res.status(500).json({ error: "Failed to update slider" });
  }
};

// Delete slider
exports.deleteSlider = async (req, res) => {
  try {
    const slider = await HomePageSlider.findByPk(req.params.id);
    if (!slider) return res.status(404).json({ error: "Slider not found" });

    await slider.destroy();
    res.json({ message: "Slider deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete slider" });
  }
};
