const fs = require('fs')
const path = require('path')

const { validationResult } = require('express-validator/check');

const Post = require ('../models/post');
const User = require('../models/user')

exports.getPosts = async (req, res, next) => {

    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    try{
    const totalItems = await Post.find().countDocuments()
    const posts = await Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
     

    res.status(200).json({ message: 'fetched posts', posts: posts, totalItems});
    } catch(err) {
        if (err.status){
            err.statusCode = 500;      
        } 
        next(err);
    }

};

exports.createPost = async (req, res, next) => {
    //validation other part
    const errors = validationResult(req);
    //if errors is not empty then errors happoened
    if (!errors.isEmpty()){
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        throw error;
    }
    //file upload.. if not set so error stuff
    if (!req.file) {
        const error = new Error('no image provided');
        //validation error, and thorw
        error.statusCode = 422;
        throw error
    }

    //multer sets up path
    const imageUrl = req.file.path.replace("\\" ,"/");
    const title = req.body.title;
    const content = req.body.content;
    //201 - tell client successfully created, 200 is just success 
    
    //4tyh part of mongodb
    const post = new Post ({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });
    try{
    await post.save()
    //add to list of posts of user
    const user = await User.findById(req.userId);
        user.posts.push(post);
    await user.save();
        res.status(201).json({
            message: 'Post successful',
            post: post,
            creator: {_id: user._id, name: user.name}
        });
    }   catch(err){
        if (err.status){
            err.statusCode = 500;      
        } 
        next(err);
    }

};

exports.getPost= async (req, res, next) => {
    const postId= req.params.postId;
    try{  
    const post = await Post.findById(postId)
      
        if (!post){
            const error = new Error('Could not find Post')
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Post fetched.', post:post})
    } catch (err) {
        if (err.status){
            err.statusCode = 500;      
        } 
        next(err);
    }    

}

exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId;
    //validation other part
    const errors = validationResult(req);
    //if errors is not empty then errors happoened
    if (!errors.isEmpty()){
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        throw error;
    }
    //validation other part

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    //if there is a file 
    if (req.file){
        imageUrl = req.file.path.replace("\\","/");
    }
    //if no file throw error
    if (!imageUrl){
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    }
    try{
    const post = await Post.findById(postId)
    
        if (!post){
            const error = new Error('Could not find Post')
            error.statusCode = 404;
            throw error;
        }
        if (post.creator.toString() !== req.userId){
            const error = new Error('Not authorized!')
            error.statusCode = 403
            throw error;
        }
        if (imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl
        post.content = content;
        const result = await post.save();
        res.status(200).json({ message: 'Post updated!', post: result})
    } catch(err){
        if (err.status){
            err.statusCode = 500;      
        } 
        next(err);
    }

};

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try{
    const post = await Post.findById(postId)
 
        if (!post){
            const error = new Error('Could not find Post')
            error.statusCode = 404;
            throw error;
        }
        //check logged in user
        if (post.creator.toString() !== req.userId){
            const error = new Error('Not authorized!')
            error.statusCode = 403
            throw error;
        }
        //delete image
        clearImage(post.imageUrl)
        await Post.findByIdAndRemove(postId);




        //deleting user connection to post
        const user = await User.findById(req.user.id)

        //deletes comparison
        user.posts.pull(postId)
        await user.save()


        res.status(200).json({message: 'Post Deleted!'})
    }
    catch(err){
        if (err.status){
            err.statusCode = 500;      
        } 
        next(err);
    }
}


const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    //delete function
    fs.unlink(filePath, err => console.log(err));
}