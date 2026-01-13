const User = require("../../model/user");
const cloudinary = require("../../config/cloudinary");
const Blog = require("../../model/blog");
const commentModel = require("../../model/comment");
const LikeModel = require("../../model/like");

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    

    const isMatched = await user.comparePassword(req.body.password);
   
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    } 


    const blogs = Blog.find({ createdBy: userId });
    
    for await (const blog of blogs) {
      await commentModel.deleteMany({ blogId: blog._id });
      await LikeModel.deleteMany({ LikedOn: blog._id });
      await cloudinary.uploader.destroy(blog.coverImageURL.publicId);
      await Blog.deleteOne({ _id: blog._id });
    }

    
    await cloudinary.uploader.destroy(user.avatar.publicId);
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: true, // prod me
    });

    await user.deleteOne();

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
