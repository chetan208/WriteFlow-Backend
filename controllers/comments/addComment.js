const commentModel=require("../../model/comment")

async function addComment(req,res,blogId){
    const {content} = req.body
    const user = req.user
    

    if(!user){
        console.log("unAthorized access")
        return res.json({
            success:false,
            meassage:"unAthourazed access"
        })
    }

    try {
        await commentModel.create({
            content,
            createdBy:user._id,
            username:user.name,
            userAvatar:user.avatar.url,
            blogId
        })
        return res.json({
            success:true,
            message:"comment added successfully"
        })
    } catch (error) {
        console.log("error in creating comment " , error)
    }
}

module.exports=addComment