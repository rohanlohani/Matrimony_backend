function buildSliderImageUrl(req, imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return imagePath; // keep as relative path, frontend can prepend server URL if needed
}

function handleSliderImage(req, sliderData, existingSlider = null) {
  if (req.files?.image_path && req.files.image_path[0]) {
    // If a new file is uploaded, use that filename
    sliderData.image_path = req.files.image_path[0].filename;
  } else if (existingSlider?.image_path) {
    // Keep existing filename if no new upload
    sliderData.image_path = existingSlider.image_path;
  } else {
    // Fallback image if none uploaded
    sliderData.image_path = "default-slider.jpg";
  }

  return sliderData;
}

module.exports = { buildSliderImageUrl, handleSliderImage };
