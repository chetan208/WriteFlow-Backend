const { validateToken } = require("../services/auth");

function  checkForAuthenticationCookie(req,cookieName) {
        const cookieValue = req.cookies[cookieName];

        if (!cookieValue) {
            return (
                    {
                        success: false,
                        message: "Authentication required"
                    }
            )
        }

        try {
            const payload =  validateToken(cookieValue);
            return{
                ...payload,
                success:true,
                message:"user logged in"
            } 

        } catch (error) {
            return (
                {
                    success: false,
                    message: error.message
                })
            
        }
    }



module.exports = {
    checkForAuthenticationCookie,
}