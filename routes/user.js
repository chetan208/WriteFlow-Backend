const { Router } = require("express");
const User = require("../model/user");
const { checkForAuthenticationCookie } = require("../services/authentication");
const deleteAccount = require("../controllers/user/deleteAccount");
const checkForAuthenticationCookieMiddelware = require("../middelwares/checkForAuthentication")


const upload = require("../middelwares/upload");
const cloudinary = require("../config/cloudinary");
const findUser = require("../controllers/user/findUser");

const router = Router();


const { Resend } = require("resend");
const VerifyAccount = require("../controllers/user/verifyAccount");
const setupProfile = require("../controllers/user/set-upProfile");








router.post("/signup", async (req, res) => {
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  const { email, password } = req.body;
  const otp = generateOTP()

  const resend = new Resend(process.env.RESEND_API_KEY);

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const existingUser = await User.findOne({ email })
  const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  if (existingUser && existingUser.isVerified) {
    return res.json({
      success: false,
      message: "email registered already"
    })
  }

  if (existingUser && !existingUser.isVerified) {
    existingUser.otp = otp;
    existingUser.expiryTime= expiryTime;
    existingUser.password=password

    await existingUser.save()



    await resend.emails.send({
      from: 'Blogit <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your email',
      html: `
    <h2>Verify your Blogit account</h2>
    <p>Your OTP is <b>${otp}</b></p>
  `

    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });



  }

  else{
    await User.create({
    email,
    password,
    otp,
    expiryTime
  });

  await resend.emails.send({
    from: 'Blogit <onboarding@resend.dev>',
    to: email,
    subject: 'Verify your email',
    html: `
    <h2>Verify your Blogit account</h2>
    <p>Your OTP is <b>${otp}</b></p>
  `
  });
  res.status(201).json({
    success: true,
    message: "Account created successfully",
  });
  }

  

  
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    res
      .cookie("token", token, {
        httpOnly: true,   // JS se access nahi hoga (secure)
        secure: true,
        sameSite: "None",
        path: "/",  // csrf protection
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
      });

  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }

})

router.get('/checkauth', async (req, res) => {



  const payload = await checkForAuthenticationCookie(req, "token")
  return res.json(payload)

})

router.post('/logout', (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });
  res.json({ success: true });
})

router.delete("/delete-account", checkForAuthenticationCookieMiddelware("token"), deleteAccount)

router.get("/finduser/:id", async (req, res) => {
  const { id } = req.params;
  await findUser(id, res); // DB function
});


router.post("/signup/verify-account/:email", async (req, res) => {
  const { email } = req.params;
  await VerifyAccount(req, res, email)
})

router.post("/setup-profile",upload.single("profilePic"),async(req,res)=>{
  await setupProfile(req,res)
})


module.exports = router;