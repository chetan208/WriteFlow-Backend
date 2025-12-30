const { Router } = require("express");
const User = require("../model/user");
const {checkForAuthenticationCookie} = require("../services/authentication");
const  deleteAccount = require("../controllers/user/deleteAccount");
const checkForAuthenticationCookieMiddelware=require("../middelwares/checkForAuthentication")


const upload = require("../middelwares/upload");
const cloudinary = require("../config/cloudinary");
const findUser = require("../controllers/user/findUser");

const router = Router();






router.post('/signup',upload.single("avatar"), async (req, res) => {
  
    const { fullName, email, password, } = req.body;

    let  url=""
    let publicId=""


    try {
        if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
        
      });
      url=result.secure_url
        publicId=result.public_id
    }
        
    } catch (error) {
        
        console.log(error)
    }



    await User.create(
        {
            fullName,
            email,
            password,
            avatar:{
                url,
                publicId

            }
        });



    return res.status(201).json({
        success: true,
        message: "Account created successfully",
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);

        res
            .cookie("token", token, {
                httpOnly: true,   // JS se access nahi hoga (secure)
                secure:true,
                sameSite: "None",  // csrf protection
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            })
            .status(200)
            .json({
                success: true,
                message: "Login successful",
            });

    } catch (error) {
        res.status(404).json({
            error:error.message
        })
    }

})

router.get('/checkauth',async(req,res)=>{



   const payload= await checkForAuthenticationCookie(req,"token")
   return res.json(payload)

})

router.post('/logout',(req,res)=>{
  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
});
res.json({ success: true });
})

router.delete("/delete-account", checkForAuthenticationCookieMiddelware("token") ,deleteAccount)

router.get("/finduser/:id", async (req, res) => {
    const { id } = req.params;
    await findUser(id,res); // DB function
});



module.exports = router;