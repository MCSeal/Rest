const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//3. require mong, do the schema


const postSchema = new Schema ({
    title:{
        type: String,
        require: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content:{
        type: String,
        required:true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
},
    { timestamps: true}
);

module.exports = mongoose.model('Post', postSchema);