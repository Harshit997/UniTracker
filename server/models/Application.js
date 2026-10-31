const mongoose = require("mongoose");

const hrSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  response: { type: String, default: "No response yet" },
  notes: { type: String, default: "" },
});

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["on-campus", "off-campus"],
      required: true,
    },
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    jobType: {
      type: String,
      enum: ["full-time", "internship", "internship + ppo"],
      default: "full-time",
    },
    workMode: {
      type: String,
      enum: ["on-site", "remote", "hybrid"],
      default: "on-site",
    },
    location: { type: String, default: "" },
    status: {
      type: String,
      enum: [
        "wishlist",
        "applied",
        "online test",
        "interview",
        "offer",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      default: "wishlist",
    },
    appliedDate: { type: Date, default: null },
    deadline: { type: Date, default: null },
    packageAmount: { type: Number, default: null },
    packageUnit: {
      type: String,
      enum: ["LPA", "per month"],
      default: "LPA",
    },
    source: { type: String, default: "" },
    companyLinkedin: { type: String, default: "" },
    careerPage: { type: String, default: "" },
    hrs: [hrSchema],
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);