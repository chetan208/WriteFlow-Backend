const cloudinary = require("../../config/cloudinary");
const Blog = require("../../model/blog");
const generateContent = require("../../AI/generateContent");

async function editBlogController(req, res, blogId) {

    try {
        const { title, body} = req.body;
        const discription = await generateContent(`
         Generate a one-line summary of the following HTML blog  content in simple language.
         The summary should start with "Writing about ..." and be only one line long.
         Keep it concise, between 10 to 12 words. Ignore HTML tags 
    
          HTML content:${body}`)

        const existingBlog = await Blog.findById({ _id: blogId })
        

        let url = existingBlog.coverImageURL.url
        let publicId = existingBlog.coverImageURL.publicId


        // file upload
        if (req.file) {
            await cloudinary.uploader.destroy(existingBlog.coverImageURL.publicId);
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "Blog_coverImages"
            });
            url = result.secure_url;
            publicId = result.public_id;
        }else{
            console.log("file not found")
        }
        existingBlog.title=title;
        existingBlog.coverImageURL.url=url;
        existingBlog.coverImageURL.publicId=publicId;
        existingBlog.body=body;
        existingBlog.discription=discription

        await existingBlog.save()
        
        console.log("user updated")

        return res.json({
            success:true,
            message:"user updated successfully"
        })

    }
    catch (error) {
        console.log("error in updating blog")
        res.json({
            success: true,
            message: "error in updating blog"
        })
    }
}

module.exports=editBlogController
