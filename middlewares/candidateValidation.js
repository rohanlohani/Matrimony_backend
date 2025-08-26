const { body, validationResult } = require("express-validator");

// Validation for creating a candidate (all required fields)
exports.validateCandidate = [
  // Personal Info
  body("name").notEmpty().withMessage("Name is required"),
  body("dob").isDate().withMessage("DOB must be a valid date"),
  body("birth_place").notEmpty().withMessage("Birth place is required"),
  body("candidate_gender").notEmpty().withMessage("Gender is required"),
  body("manglik").notEmpty().withMessage("Manglik is required"),
  body("gotra").notEmpty().withMessage("Gotra is required"),
  body("maternal_gotra").notEmpty().withMessage("Maternal Gotra is required"),

  // Contact
  body("email").isEmail().withMessage("Invalid email"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("contact_no").notEmpty().withMessage("Contact number is required"),

  // Physical Details
  body("height").notEmpty().withMessage("Height is required"),
  body("body_type").notEmpty().withMessage("Body type is required"),
  body("complexion").notEmpty().withMessage("Complexion is required"),
  body("blood_group").notEmpty().withMessage("Blood group is required"),

  // Education & Profession
  body("education").notEmpty().withMessage("Education is required"),
  body("occupation").notEmpty().withMessage("Occupation is required"),

  // Extra
  body("about_me").notEmpty().withMessage("About me is required"),

  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation for updating a candidate (fields optional)
exports.validateCandidateUpdate = [
  // Personal Info
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("dob").optional().isDate().withMessage("DOB must be a valid date"),
  body("birth_place")
    .optional()
    .notEmpty()
    .withMessage("Birth place cannot be empty"),
  body("candidate_gender")
    .optional()
    .notEmpty()
    .withMessage("Gender cannot be empty"),
  body("manglik").optional().notEmpty().withMessage("Manglik cannot be empty"),
  body("gotra").optional().notEmpty().withMessage("Gotra cannot be empty"),
  body("maternal_gotra")
    .optional()
    .notEmpty()
    .withMessage("Maternal Gotra cannot be empty"),

  // Contact
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number cannot be empty"),
  body("contact_no")
    .optional()
    .notEmpty()
    .withMessage("Contact number cannot be empty"),

  // Physical Details
  body("height").optional().notEmpty().withMessage("Height cannot be empty"),
  body("body_type")
    .optional()
    .notEmpty()
    .withMessage("Body type cannot be empty"),
  body("complexion")
    .optional()
    .notEmpty()
    .withMessage("Complexion cannot be empty"),
  body("blood_group")
    .optional()
    .notEmpty()
    .withMessage("Blood group cannot be empty"),

  // Education & Profession
  body("education")
    .optional()
    .notEmpty()
    .withMessage("Education cannot be empty"),
  body("occupation")
    .optional()
    .notEmpty()
    .withMessage("Occupation cannot be empty"),

  // Extra
  body("about_me")
    .optional()
    .notEmpty()
    .withMessage("About me cannot be empty"),

  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
