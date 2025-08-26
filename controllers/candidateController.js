const Candidate = require("../models/candidateModel");

// Create a new candidate
exports.createCandidate = async (req, res) => {
  try {
    const { name, dob, phone } = req.body;

    // Check if candidate already exists
    const existingCandidate = await Candidate.findOne({
      where: { name, dob, phone },
    });
    if (existingCandidate) {
      return res.status(400).json({ error: "Candidate already exists" });
    }

    if (req.file) {
      req.body.image_path = req.file.path; // e.g., 'uploads/image-123456.jpg'
    }

    const candidate = await Candidate.create(req.body);
    res.status(201).json({
      message: "Candidate created successfully",
      candidate,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to create candidate", details: error.message });
  }
};

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.status(200).json(candidates);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch candidates", details: error.message });
  }
};

// Get a single candidate by ID
exports.getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByPk(id);

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.status(200).json(candidate);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch candidate", details: error.message });
  }
};

// Update a candidate by ID
exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.file) {
      req.body.image_path = req.file.path; // Update image path if new file is uploaded
    }
    const [updated] = await Candidate.update(req.body, {
      where: { id },
    });

    if (!updated) {
      return res
        .status(404)
        .json({ error: "Candidate not found or no changes made" });
    }

    const updatedCandidate = await Candidate.findByPk(id);
    res.status(200).json({
      message: "Candidate updated successfully",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to update candidate", details: error.message });
  }
};

// Delete a candidate by ID
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Candidate.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to delete candidate", details: error.message });
  }
};
