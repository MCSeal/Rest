exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{ title: 'First Post', content: 'first post' }]
    });
};

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    //201 - tell client successfully created, 200 is just success 
    res.status(201).json({
        message: 'Post succesful',
        post: {id: new Date().toISOString(), title: title, content: content }
    });

};