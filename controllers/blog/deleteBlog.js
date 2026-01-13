const Blog = require('../../model/blog')
const cloudinary = require("../../config/cloudinary");
const commentModel = require('../../model/comment');

const likeModel = require('../../model/like');

async function deleteBlog(_id,userId){

      try {

        const blog= await Blog.findOne({_id}) 

        const userIdInDb=blog.createdBy.toString()

       try {
         await commentModel.deleteMany({blogId:blog._id});
        await likeModel.deleteMany({LikedOn:blog._id});
        
       } catch (error) {
        console.log("error in deleting comments and likes associated with the blog")    
       }

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