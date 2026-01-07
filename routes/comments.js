const commentModel = require("../model/comment")
const {Router}= require("express")
const checkForAuthenticationCookieMiddelware = require('../middelwares/checkForAuthentication');
const addComment = require("../controllers/comments/addComment");
const getComments = require("../controllers/comments/viewComments");

const router=Router();

router.post("/add/:id",checkForAuthenticationCookieMiddelware("token"),async(req,res)=>{
    const {id}=req.params
    try {
        await addComment(req,res,id)
    } catch (error) {
        console.log("error in adding comment",error)
    }
})

router.get("/get-comment/:id",async(req,res)=>{
    const {id}=req.params
    try {
        getComments(res,id)
    } catch (error) {
        console.log("error in route file",error)
    }
})


module.exports=router
