const { Router } = require("express");
const User = require("../model/user");

const router = Router();



router.get('/login', (req, res) => {
   res.json(
    {
        msg:"welcome to login page"
    }
   )
});

router.get('/signup', (req, res) => {
    return res.render('signup', {
        error: null
    });
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password, } = req.body;
    await User.create(
        {
            fullName,
            email,
            password,
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
                secure: false,    // true only in https
                sameSite: "lax",  // csrf protection
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

module.exports = router;