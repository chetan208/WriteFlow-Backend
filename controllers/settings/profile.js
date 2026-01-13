const User = require("../../model/user");
const cloudinary = require("../../config/cloudinary");

const { createTokenForUser } = require("../../services/auth");



async function changeProfile(req, res) {
    
    const { fullName, bio, profileChanged,} = req.body;
    
    const existingUser = await User.findOne({ email: req.user.email });

    
  
    if (profileChanged==="false") {
        existingUser.fullName = fullName;
        existingUser.bio = bio;
        await existingUser.save()

        const token = createTokenForUser(existingUser)
        return res
         .cookie("token", token, {
                    httpOnly: true,
                    secure: true,     // ❗ localhost ke liye false
                    sameSite: "none",   // ❗ localhost friendly
                    maxAge: 24 * 60 * 60 * 1000,
                })
        
        .json({
            success: true,
            message: "profile updated successfully without changing profile picture"
        })
    }

    

    if (profileChanged === "true") {
        const profilePic = req?.file;
        await cloudinary.uploader.destroy(existingUser.avatar.publicId);

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Blogit_ProfileImages",

        });

        const avatar = {
            url: result.secure_url,
            publicId: result.public_id,
        }
        existingUser.fullName = fullName;
        existingUser.bio = bio;
        existingUser.avatar = avatar;
        await existingUser.save()

        const token = createTokenForUser(existingUser)
       
        return res
         .cookie("token", token, {
                    httpOnly: true,
                    secure: true,     // ❗ localhost ke liye false
                    sameSite: "none",   // ❗ localhost friendly
                    maxAge: 24 * 60 * 60 * 1000,
                })
        .json({
            success: true,
            message: "profile updated successfully with new profile picture"
        })


    }

    return res.json({
        success: false,
        message: "unable to update profile"
    })
}

module.exports = changeProfile;