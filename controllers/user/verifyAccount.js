const User = require("../../model/user");


async function VerifyAccount(req, res, email) {
    
     const { code } = req.body
     console.log(code)
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.json({
                success: false,
                message: "user not found to be verify"
            })

        }
        if (user.expiryTime < Date.now()) {
            return res.json({
                success: false,
                message: "code expired"
            })
        }

           

            if (code !== user.otp) {
            return res.json({
                success: false,
                message: "Invalid OTP",
            });
        }
            if (code === user.otp) {
                user.isVerified = true;
                user.otp = undefined;
                user.expiryTime = undefined;

                await user.save();
                res.json({
                    success: true
                })
            };


            return res.json({
                success: false,
                message: "Invalid OTP",
            });



        } catch (error) {
            console.log("error in verifying user",error)
            res.json({
                succuss: false,
                message: "error in veryfying"
            })
        }
    }

module.exports = VerifyAccount;