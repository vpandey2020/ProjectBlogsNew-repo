const mongoose = require("mongoose");
const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");
const { findOneAndUpdate } = require("../model/blogModel");
const ObjectId = mongoose.Schema.Types.ObjectId;

const createBlog = async function(req, res) {
    try {
        let data = req.body;
        let author = await authorModel.find({ _id: data.authorId });
        if (author) {
            let savedData = await blogModel.create(data);
            res.status(201).send({ msg: savedData });
        } else {
            res.status(400).send("Author does not exist");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getBlogs = async function(req, res) {
    try {
        let array = [];
        let authorId = req.query.authorId;
        let tags = req.query.tags;
        let category = req.query.category;
        let subCategory = req.query.subCategory;
        let getBlog = await blogModel.find({
            $or: [
                { authorId: authorId },
                { category: category },
                { tags: tags },
                { subCategory: subCategory },
            ],
        });
        if (getBlog.length > 0) {
            for (let element of getBlog) {
                if (element.isDeleted === false && element.isPublished === true) {
                    array.push(element);
                }
            }
            res.status(200).send({ status: true, data: array });
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};


// update

const updateBlog = async function(req, res) {
    let blogId = req.params.blogId;

    let data = req.body;

    let x = await blogModel.findById(blogId);
    console.log(x);
    try {
        if (x) {
            if (x.isDeleted === false) {
                if (data.isPublished === true) {
                    let a = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isPublished: true, publishedAt: Date.now() } });
                }

                let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, {...data }, { new: true });

                return res
                    .status(200)
                    .send({ msg: "blog updated successfully", updatedBlog });
            } else {
                return res.status(404).send({ msg: "blog not found" });
            }
        } else {
            return res.status(404).send({ msg: "blog id not found" });
        }
    } catch (error) {
        return res.status(500).send({ ERROR: error.message });
    }
};

// delete by id

let deleteBlogById = async function(req, res) {
    try {
        let id = req.params.blogId;
        console.log(id);
        if (id) {
            let deletedBlog = await blogModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } });
            console.log(deletedBlog);
            res.send(deletedBlog);
        } else res.status(400).send("BAD REQUEST");
    } catch (err) {
        res.status(500).send({ msg: error.message });
    }
};

//delete by query params

let deletedByQueryParams = async function(req, res) {
    try {
        let data = req.query;

        if (data) {
            let deletedBlogsFinal = await blogModel.updateMany({ $in: data }, { $set: { isDeleted: true } });

            res.status(200).send({ status: true });
        } else {
            res.status(400).send({ ERROR: "BAD REQUEST" });
        }
    } catch (error) {
        res.status(500).send({ ERROR: error.message });
    }
};

const getAllBlogs = async function(req, res) {
    const details = await blogModel.find()
    res.send({ msg: details })
}

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlogById = deleteBlogById;
module.exports.deletedByQueryParams = deletedByQueryParams;
module.exports.getAllBlogs = getAllBlogs