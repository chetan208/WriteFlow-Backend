const commentModel = require("../../model/comment")
const User = require("../../model/comment")

async function getComments(res,id){
    try {
        const comments= await commentModel.find({blogId:id}).sort({ createdAt: -1 });
        
        res.json({
            success:true,
            comments:{comments}
        })
    } catch (error) {
        console.log("error in geting comments from database",error)
        res.json({
            success:false,
            error:error.message
        })
    }
}

module.exports=getComments;