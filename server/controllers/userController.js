const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const { college, course, semester } = req.body;

    if (!college || !course || !semester) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findById(req.user._id);

    user.college = college;
    user.course = course;
    user.semester = semester;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      college: updatedUser.college,
      course: updatedUser.course,
      semester: updatedUser.semester,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile };