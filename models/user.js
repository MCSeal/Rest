const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'I am new!'
    },
    posts: [{
        //references to post, ref key links to post
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

module.exports = mongoose.model('User', userSchema)