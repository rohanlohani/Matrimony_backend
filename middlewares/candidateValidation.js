const { body, validationResult } = require("express-validator");

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
