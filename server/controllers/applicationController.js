const Application = require("../models/Application");

const findUserApplication = (req) =>
  Application.findOne({ _id: req.params.id, user: req.user._id });

const handleError = (res, error) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.name === "CastError") {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(500).json({ message: error.message });
};

const createApplication = async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const applications = await Application.find(filter).sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { user, hrs, comments, ...updates } = req.body;

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(500).json({ message: error.message });
  }
};


const addHr = async (req, res) => {
  try {
    const application = await findUserApplication(req);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.hrs.push(req.body);
    await application.save();

    res.status(201).json(application);
  } catch (error) {
    handleError(res, error);
  }
};

const updateHr = async (req, res) => {
  try {
    const application = await findUserApplication(req);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const hr = application.hrs.id(req.params.hrId);
    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }

    const { _id, ...changes } = req.body;
    hr.set(changes);
    await application.save();

    res.json(application);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteHr = async (req, res) => {
  try {
    const application = await findUserApplication(req);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const hr = application.hrs.id(req.params.hrId);
    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }

    application.hrs.pull(req.params.hrId);
    await application.save();

    res.json(application);
  } catch (error) {
    handleError(res, error);
  }
};

const addComment = async (req, res) => {
  try {
    const application = await findUserApplication(req);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.comments.push({ text: req.body.text });
    await application.save();

    res.status(201).json(application);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteComment = async (req, res) => {
  try {
    const application = await findUserApplication(req);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const comment = application.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    application.comments.pull(req.params.commentId);
    await application.save();

    res.json(application);
  } catch (error) {
    handleError(res, error);
  }
};

const getStats = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const byStatus = {};
    const byCategory = { "on-campus": 0, "off-campus": 0 };

    applications.forEach((app) => {
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;
      byCategory[app.category] += 1;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const closedStatuses = ["accepted", "rejected", "withdrawn"];

    const summary = (app) => ({
      _id: app._id,
      companyName: app.companyName,
      role: app.role,
      status: app.status,
      category: app.category,
      deadline: app.deadline,
    });

    const upcomingDeadlines = applications
      .filter(
        (app) =>
          app.deadline &&
          app.deadline >= today &&
          !closedStatuses.includes(app.status)
      )
      .sort((a, b) => a.deadline - b.deadline)
      .slice(0, 5)
      .map(summary);

    const recent = applications.slice(0, 5).map(summary);

    res.json({
      total: applications.length,
      byCategory,
      byStatus,
      upcomingDeadlines,
      recent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
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
  getStats
};