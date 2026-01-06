const Blog = require('../../model/blog')
const cloudinary = require("../../config/cloudinary");

async function deleteBlog(_id,userId){

      try {

        const blog= await Blog.findOne({_id}) 

        const userIdInDb=blog.createdBy.toString()
        if(userId === userIdInDb) {
                await cloudinary.uploader.destroy(blog.coverImageURL.publicId);
                await Blog.deleteOne({_id})
                return ({
                    success:true,
                    message:"blog deleted successfully"
                })
        }else{
            return({
                success:false,
                message:"user not matched"
            })
        }

      } catch (error) {
        return({
            success:false,
            message:"error in deleting blog ",
            error:error.message
        })
        
      }
}

module.exports= deleteBlog;