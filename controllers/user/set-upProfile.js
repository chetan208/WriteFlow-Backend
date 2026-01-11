const cloudinary = require("../../config/cloudinary")
const User = require("../../model/user")

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

                return res.json({
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