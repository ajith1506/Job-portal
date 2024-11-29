const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} = require("../conrollers/applicationConroller");
const router = express.Router();

router.get("/apply/:id", isAuthenticated, applyJob);
router.get("/get", isAuthenticated, getAppliedJobs);
router.get("/:id/applicants", isAuthenticated, getApplicants);
router.post("/status/:id/update", isAuthenticated, updateStatus);

module.exports = router;
