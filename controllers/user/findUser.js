const User = require("../../model/user")

async function findUser(_id ,res){
  User.findOne({_id})
  .then((user)=>{
    user? (
         res.json(user)
    ) : console.log("user not found")
  })
  .catch((err)=>res.json(err))
  
}

module.exports= findUser