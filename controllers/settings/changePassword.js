
const User = require("../../model/user");

async function changePassword(req,res){
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

   
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const user = await User.findById(userId);
    const isMatch = user.comparePassword(oldPassword);

    if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
}

module.exports = changePassword;