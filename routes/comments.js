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

router.delete("/delete-comment/:id",async(req,res)=>{
    const {id} =req.params
    try {
        await commentModel.findByIdAndDelete({_id:id})
        return res.json({
            success:true,
            message:"comment delted successfully"
        })
    } catch (error) {
        console.log("error in deleting comment", error)
        return res.json({
            success:false,
            message:"error in deleting messages"
        })
    }
})

router.patch("/edit-comment/:id", async(req,res)=>{
    const {id} = req.params
    const {content}= req.body
    try {
        await commentModel.findByIdAndUpdate(id, { content });
        return res.json({
            success:true,
            message:"comment edited successfully"
        })
    } catch (error) {
         console.log("error in editing comment", error)
        return res.json({
            success:false,
            message:"error in editing messages"
        })
    }
})

module.exports=router
