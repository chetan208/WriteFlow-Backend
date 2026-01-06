const {Router} = require("express")
const upload = require("../middelwares/upload");
const {addBlogController,ViewBlog, getBlog,deleteBlog,editBlogController} = require('../controllers/blog')
const checkForAuthenticationCookieMiddelware = require('../middelwares/checkForAuthentication');
const generateContent = require("../AI/generateContent");







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


module.exports=router;