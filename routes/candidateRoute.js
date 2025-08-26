const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const { validateCandidate } = require("../middlewares/candidateValidation");

router.post("/", validateCandidate, candidateController.createCandidate);
router.get("/", candidateController.getAllCandidates);
router.get("/:id", candidateController.getCandidateById);
router.put("/:id", validateCandidate, candidateController.updateCandidate);
router.delete("/:id", candidateController.deleteCandidate);

module.exports = router;
