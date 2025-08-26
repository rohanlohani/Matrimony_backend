const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const upload = require("../middlewares/uploadMiddleware");
const {
  validateCandidate,
  validateCandidateUpdate,
} = require("../middlewares/candidateValidation");

router.post(
  "/",
  upload.single("image"),
  validateCandidate,
  candidateController.createCandidate
);
router.get("/", candidateController.getAllCandidates);
router.get("/:id", candidateController.getCandidateById);
router.put(
  "/:id",
  upload.single("image"),
  validateCandidateUpdate,
  candidateController.updateCandidate
);
router.delete("/:id", candidateController.deleteCandidate);

module.exports = router;
