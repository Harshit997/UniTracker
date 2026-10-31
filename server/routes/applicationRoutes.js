const express = require("express");
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  addHr,
  updateHr,
  deleteHr,
  addComment,
  deleteComment,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getApplications).post(createApplication);

router
  .route("/:id")
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

router.post("/:id/hrs", addHr);
router.route("/:id/hrs/:hrId").put(updateHr).delete(deleteHr);

router.post("/:id/comments", addComment);
router.delete("/:id/comments/:commentId", deleteComment);

module.exports = router;