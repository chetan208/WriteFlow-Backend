const User = require("../../model/user");
const cloudinary = require("../../config/cloudinary");

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await cloudinary.uploader.destroy(user.avatar.publicId);
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: true, // prod me
    });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Account delete failed",
    });
  }
};

module.exports = deleteAccount;
