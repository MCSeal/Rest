const express = require('express');
const feedController = require('../controller/feed');


const router = express.Router();


//get feed/posts
router.get('/posts', feedController.getPosts); 




//post  //feed /post
router.post('/post', feedController.createPost)

module.exports = router;
