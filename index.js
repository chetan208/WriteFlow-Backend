require("dotenv").config();
const express= require("express");
const mongoose=require("mongoose")
const cookieParser=require("cookie-parser");



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
const blogRoute=require("./routes/blog")
const commentRoute=require("./routes/comments")

app.use(cors({
  origin: process.env.FRONT_END_URL  ,  // frontend URL
  credentials: true  // if you are sending cookies
}));

app.get("/",
    (req,res)=>{
    return res.send("this is home page")
})

app.use("/api",userRoute);
app.use("/api/blog",blogRoute);
app.use("/api/comment",commentRoute)


app.listen(PORT,()=>(console.log("server started at Port ", PORT)))