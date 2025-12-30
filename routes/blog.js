const {Router} = require("express")
const upload = require("../middelwares/upload");
const {addBlogController,ViewBlog, getBlog} = require('../controllers/blog')
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

module.exports=router;