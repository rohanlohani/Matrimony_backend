const Candidate = require("../models/candidateModel");
const { Op } = require("sequelize");

// Build absolute URL for image_path
function buildImageUrl(req, imagePath) {
  if (!imagePath || imagePath === "default-profile.jpg") return imagePath;
  if (typeof imagePath === "string" && imagePath.startsWith("http")) return imagePath;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${imagePath}`;
}

// Create a new candidate
exports.createCandidate = async (req, res) => {
  try {
    console.log("Received candidate data:", req.body);
    console.log("Received files:", req.files);

    // Extract all fields from request body
    const candidateData = {
      // Personal Info
      name: req.body.name,
      dob: req.body.dob,
      birth_place: req.body.birth_place,
      candidate_gender: req.body.candidate_gender,
      manglik: req.body.manglik,
      gotra: req.body.gotra,
      maternal_gotra: req.body.maternal_gotra,

      // Family Info
      father_name: req.body.father_name,
      father_mobile: req.body.father_mobile,
      father_occupation: req.body.father_occupation || null,
      father_annual_income: req.body.father_annual_income ? parseInt(req.body.father_annual_income) : null,
      mother_name: req.body.mother_name || null,
      mother_occupation: req.body.mother_occupation || null,
      grandfather: req.body.grandfather || null,
      native_place: req.body.native_place || null,
      nationality: req.body.nationality || null,
      status_of_family: req.body.status_of_family || null,

      // Address & Contact
      address: req.body.address || null,
      country: req.body.country || "India",
      state: req.body.state,
      district: req.body.district || null,
      pin_code: req.body.pin_code || null,
      phone: req.body.phone || null,
      contact_no: req.body.contact_no,
      email: req.body.email,

      // Physical Details
      height: req.body.height,
      body_type: req.body.body_type,
      complexion: req.body.complexion,
      blood_group: req.body.blood_group,

      // Education & Profession
      education_detail: req.body.education_detail || null,
      education: req.body.education,
      hobby: req.body.hobby || null,
      occupation: req.body.occupation,
      designation: req.body.designation || null,
      annual_income: req.body.annual_income ? parseInt(req.body.annual_income) : null,
      company_name: req.body.company_name || null,
      company_city: req.body.company_city || null,

      // Siblings Info
      no_unmarried_brother: req.body.no_unmarried_brother ? parseInt(req.body.no_unmarried_brother) : 0,
      no_unmarried_sister: req.body.no_unmarried_sister ? parseInt(req.body.no_unmarried_sister) : 0,
      no_married_brother: req.body.no_married_brother ? parseInt(req.body.no_married_brother) : 0,
      no_married_sister: req.body.no_married_sister ? parseInt(req.body.no_married_sister) : 0,

      // Relatives Info
      relation: req.body.relation || null,
      relative_name: req.body.relative_name || null,
      relative_mobile_no: req.body.relative_mobile_no || null,
      relative_city: req.body.relative_city || null,
      relative_company_name: req.body.relative_company_name || null,
      relative_designation: req.body.relative_designation || null,
      relative_company_address: req.body.relative_company_address || null,

      // Extra
      kundali_milana: req.body.kundali_milana || null,
      about_me: req.body.about_me,
      image_path: req.body.image_path || "default-profile.jpg",

      // Subscription
      subscription: req.body.subscription === "1" || req.body.subscription === "true",
    };

    // Upsert behavior: if a candidate exists with same email OR contact number, update instead of erroring
    const existingCandidate = await Candidate.findOne({
      where: {
        [Op.or]: [
          { email: candidateData.email },
          { contact_no: candidateData.contact_no },
        ],
      },
    });

    if (existingCandidate) {
      // If a new profile photo is uploaded, set it on candidateData
      if (req.files && req.files.profilePhoto) {
        candidateData.image_path = req.files.profilePhoto[0].filename;
        console.log("Profile photo uploaded (update):", req.files.profilePhoto[0].filename);
      } else if (!existingCandidate.image_path) {
        candidateData.image_path = "default-profile.jpg";
      }

      await Candidate.update(candidateData, { where: { id: existingCandidate.id } });
      const updatedCandidate = await Candidate.findByPk(existingCandidate.id);
      const updatedResponse = updatedCandidate.toJSON();
      updatedResponse.image_path = buildImageUrl(req, updatedResponse.image_path);
      return res.status(200).json({
        message: "Candidate already existed; profile updated successfully",
        id: updatedCandidate.id,
        candidate: updatedResponse,
      });
    }

    // Handle file upload if present
    if (req.files && req.files.profilePhoto) {
      candidateData.image_path = req.files.profilePhoto[0].filename;
      console.log("Profile photo uploaded:", req.files.profilePhoto[0].filename);
    } else {
      candidateData.image_path = candidateData.image_path || "default-profile.jpg";
      console.log("No profile photo uploaded, using default");
    }

    console.log("Creating candidate with data:", candidateData);

    const candidate = await Candidate.create(candidateData);
    
    // Prepare response with absolute image URL
    const candidateResponse = candidate.toJSON();
    candidateResponse.image_path = buildImageUrl(req, candidateResponse.image_path);

    res.status(201).json({
      message: "Candidate created successfully",
      id: candidate.id,
      candidate: candidateResponse,
    });
  } catch (error) {
    console.error("Error creating candidate:", error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        path: err.path,
        msg: err.message,
        value: err.value
      }));
      
      return res.status(400).json(validationErrors);
    }
    
    // Handle other Sequelize errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        error: "A candidate with this information already exists" 
      });
    }
    
    res.status(500).json({ 
      error: "Failed to create candidate", 
      details: error.message 
    });
  }
};

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    const response = candidates.map((c) => {
      const obj = c.toJSON();
      obj.image_path = buildImageUrl(req, obj.image_path);
      return obj;
    });
    res.status(200).json(response);
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

    const response = candidate.toJSON();
    response.image_path = buildImageUrl(req, response.image_path);
    res.status(200).json(response);
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
    
    // Handle file upload if present
    if (req.files && req.files.profilePhoto) {
      req.body.image_path = req.files.profilePhoto[0].filename;
      console.log("Profile photo updated:", req.files.profilePhoto[0].filename);
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
    const response = updatedCandidate.toJSON();
    response.image_path = buildImageUrl(req, response.image_path);
    res.status(200).json({
      message: "Candidate updated successfully",
      candidate: response,
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
