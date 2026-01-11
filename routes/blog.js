const {Router} = require("express")
const upload = require("../middelwares/upload");
const {addBlogController,ViewBlog, getBlog,deleteBlog,editBlogController} = require('../controllers/blog')
const checkForAuthenticationCookieMiddelware = require('../middelwares/checkForAuthentication');
const generateContent = require("../AI/generateContent");
const LikeModel = require("../model/like");







const router=Router();

router.post("/add-blog",
     [checkForAuthenticationCookieMiddelware("token"),upload.single("coverImage")],
    addBlogController);


router.get("/allblogs",ViewBlog)

router.get("/:id",async(req,res)=>{
    const { id } = req.params;
    await getBlog(id,res)
})

router.get("/ai/generate-content",async (req,res)=>{
    const result= await generateContent("give one motivationnal line to write a blog ")
    res.json({
        result,
    })
})

router.delete('/delete/:id',checkForAuthenticationCookieMiddelware("token"),async(req,res)=>{
    const user = req.user
    const {id} =req.params;

    if(user){
        console.log("user found",user)
        const result=await deleteBlog(id,user._id)
        res.json(result)
    }else{
        res.json({
            success:false,
            message:"unAthorized access"
        })
    }

})

router.patch('/edit-blog/:id',[checkForAuthenticationCookieMiddelware("token"),upload.single("coverImage")], async(req,res)=>{
    console.log(req.body)
    const user = req.user
    const {id} = req.params

     if(user){
        console.log("user found")
        editBlogController(req,res,id)
    }else{
        res.json({
            success:false,
            message:"unAthorized access"
        })
    }

    
})

router.post("/like/:id",checkForAuthenticationCookieMiddelware("token"),async(req,res)=>{
    
    const user = req.user;
    if(!user){
       return  res.json({
            success:false,
            messge:"user not logged in"
        })
    }

    try {
        const {id}= req.params;
        const isLiked= await LikeModel.findOne({LikedOn:id,LikedBy:user._id });

        if(isLiked){
            await LikeModel.findByIdAndDelete(isLiked._id)
             const likeCount = await LikeModel.countDocuments({
           LikedOn: id})
            return res.json({
                success:true,
                message:"like deleted successfully",
                likeCount:likeCount
            })
        }

        await LikeModel.create({
            LikedOn:id,
            LikedBy:user._id
        })

        const likeCount = await LikeModel.countDocuments({
        LikedOn: id})

        res.json({
            success:true,
            message:"blog liked successfully",
            likeCount:likeCount
        })

    } catch (error) {
        console.log("error while like ",error);
        return res.json({
            success:false,
            message:"error while like "
        })
    }


})

router.get("/like/:id",checkForAuthenticationCookieMiddelware("token"),async(req,res)=>{
    const {id} = req.params;
    const user = req.user
    
    const likedByCurrentUser = await LikeModel.findOne({LikedOn:id,LikedBy:user?._id || null})
    
    try {
        const likeCount = await LikeModel.countDocuments({
         LikedOn: id
        });
        return res.json({
            success:true,
            likeCount:likeCount,
            likedByCurrentUser: likedByCurrentUser? true : false,

        })
    } catch (error) {
        console.log("error in getting likes",error.message);
        return res.json({
            success:false,
            message:"error in fetching likes"
        })
    }
})

module.exports=router;