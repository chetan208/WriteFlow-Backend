const  {Schema,model} = require('mongoose')

const likeSchema=new Schema({
    LikedOn:{
        type:Schema.Types.ObjectId,
        ref:'blog'
    },
    LikedBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
})

const LikeModel = model("like",likeSchema);
module.exports = LikeModel