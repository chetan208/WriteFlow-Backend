const {Schema,model}=require("mongoose");
const {createHmac,randomBytes} =require('crypto');
const { createTokenForUser } = require("../services/auth");


const userSchema= new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    }
},{timestamps:true})

userSchema.pre('save',async function(){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt)
                            .update(user.password)
                            .digest("hex");

   user.salt=salt;
   user.password=hashedPassword;
})

userSchema.static('matchPasswordAndGenerateToken', async function(email,password){
    const user= await this.findOne({email});
    if(!user) throw new Error("No User Found!!");

    const salt = user.salt;
    const hashedPassword=user.password;

    const userProvidedhash=createHmac("sha256",salt)
                            .update(password)
                            .digest('hex');

   if(hashedPassword!==userProvidedhash) throw new Error('password incorrect');

   const token=createTokenForUser(user);
   return token;
});

const User=model('user',userSchema);

module.exports=User;