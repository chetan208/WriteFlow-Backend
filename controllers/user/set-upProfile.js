const cloudinary = require("../../config/cloudinary")
const User = require("../../model/user");
const { createTokenForUser } = require("../../services/auth");



async function setupProfile(req,res){
     const {fullName,bio,email}=req.body
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                success:false,
                message:"user not found to setup profile"
            })
        }

        

        let  url=""
        let publicId=""

        try {
                  if (req.file) {
                  const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "Blogit_ProfileImages",
                    
                  });
                  url=result.secure_url
                  publicId=result.public_id
                }
                    
                } catch (error) {
                    
                    console.log(error)
                }

                user.fullName=fullName;
                user.bio = bio;
                user.isProfileCompleted=true;
                user.avatar={
                    url,
                    publicId,
                }

                await user.save()
                const token = createTokenForUser(user)

                return res
                .cookie("token", token, {
                    httpOnly: true,
                    secure: false,     // ❗ localhost ke liye false
                    sameSite: "Lax",   // ❗ localhost friendly
                    maxAge: 24 * 60 * 60 * 1000,
                })
                .status(200)
                .json({
                    success:true,
                    message:"profile completed successfully"
                })

    } catch (error) {
        console.log("error in profile setup",error)
        res.json({
            succcess:false,
            message:true
        })
    }
}

module.exports=setupProfile;