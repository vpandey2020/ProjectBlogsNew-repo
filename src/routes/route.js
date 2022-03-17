const express = require('express');
const router = express.Router();

const authorController = require('../controller/authorController');
const blogController = require('../controller/blogController');
const authorLogin = require('../controller/loginController');
const middleware = require('../middlewares/middleware');


router.post("/createAuthor", authorController.createAuthor)
router.post("/login", authorLogin.login)

router.post("/createBlog", middleware.authenticate, blogController.createBlog)

router.get("/getBlogs", middleware.authenticate, middleware.authorize, blogController.getBlogs)
router.put("/updateBlog/:blogId", middleware.authenticate, middleware.authorize, blogController.updateBlog)
router.delete("/deleteBlogById/:blogId", middleware.authenticate, middleware.authorize, blogController.deleteBlogById)
router.delete("/deleteByQueryParams", middleware.authenticate, middleware.authorize, blogController.deletedByQueryParams)
router.get("/getAllBlogs", blogController.getAllBlogs)

module.exports = router;