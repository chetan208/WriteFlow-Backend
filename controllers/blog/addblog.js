
const cloudinary = require("../../config/cloudinary");

const Blog = require("../../model/blog");
const generateContent = require("../../AI/generateContent");

const addBlogController = async (req, res) => {
  try {
    // file check
    if (!req.file) {
      return res.status(400).send("File not uploaded");
    }

    const { title, body } = req.body;

            let  url=""
            let publicId=""
    
    
        try {
            if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Blog_coverImages",
            
          });
          url=result.secure_url
            publicId=result.public_id
        }
            
        } catch (error) {
            
            console.log(error)
        }

    const discription = await generateContent(`
     Generate a one-line summary of the following HTML blog  content in simple language.
     The summary should start with "Writing about ..." and be only one line long.
     Keep it concise, between 10 to 12 words. Ignore HTML tags 


     HTML content:${body}

      `)


    const blog = await Blog.create({
      title,
      body,
      discription,
      createdBy: req.user._id, // auth middleware se aata hai
      coverImageURL: {
        url,
        publicId
      },
    });

    // success
    return res.json({
        message:"blog added successfully",
        success:true,
        BlogImageUrl : url
    });
  } catch (error) {
    console.error("Add blog error:", error);
    return res.status(500).send("Server error");
  }

 

  res.json(
    {
      msg:"hey from backend"
    }
  )
};

module.exports = addBlogController;

