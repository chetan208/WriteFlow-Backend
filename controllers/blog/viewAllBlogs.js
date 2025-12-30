const Blog = require("../../model/blog")

const ViewBlog = async(req,res)=>{
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.json({
        success:true,
        blogs,
    })
}

module.exports=ViewBlog;
