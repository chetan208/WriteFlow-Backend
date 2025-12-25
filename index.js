require("dotenv").config();
const express= require("express");
const mongoose=require("mongoose")
const cookieParser=require("cookie-parser");
const {checkForAuthenticationCookie}=require('./middelwares/checkForAuthentication')


const app = express();


const PORT= process.env.PORT;


// conection
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongoDB is connected"))

//middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
const cors = require("cors");

const userRoute= require("./routes/user");
app.use(cors());


app.get("/",
    (req,res)=>{
    return res.send("this is home page")
})

app.use("/api",userRoute);

app.listen(PORT,()=>(console.log("server started at Port ", PORT)))