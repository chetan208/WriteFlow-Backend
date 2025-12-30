const  {Schema,model} = require('mongoose')

const blogSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    discription:{
        type:String
    },
    coverImageURL:{
        url:{
            type:String,
        required:false,
        },
        publicId:{
            type:String,
        }
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
    },
},{timestamps:true})

const Blog= model('blog',blogSchema);

module.exports=Blog;
