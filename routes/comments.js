const commentModel = require("../model/comment")
const {Router}= require("express")
const checkForAuthenticationCookieMiddelware = require('../middelwares/checkForAuthentication');
const addComment = require("../controllers/comments/addComment");

const router=Router();

router.post("/add/:id",checkForAuthenticationCookieMiddelware("token"),async(req,res)=>{
    const {id}=req.params
    try {
        await addComment(req,res,id)
    } catch (error) {
        console.log("error in adding comment",error)
    }
    res.json({
        message:"hello from commen route"
    })
})


module.exports=router
