const Blog = require('../../model/blog')

async function getBlog(_id ,res){
  Blog.findOne({_id})
  .then((blog)=>{
    blog? (
         res.json({
            success:true,
            blog,
         })
    ) : res.json({
        success:false,
        message:"blog not found"
    })
  })
  .catch((err)=>res.json(err))
  
}

module.exports= getBlog