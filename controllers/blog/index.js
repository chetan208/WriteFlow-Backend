const  addBlogController = require("./addblog");
const ViewBlog = require("./viewAllBlogs")
const getBlog   = require("./getBlog")
const deleteBlog = require("./deleteBlog")
const editBlogController = require("./edit-blog")

module.exports={
    addBlogController,
    ViewBlog,
    getBlog,
    deleteBlog,
    editBlogController
}