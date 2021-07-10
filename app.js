const express = require('express');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const path = require('path');
//database instructions 1, mongoose require, 2. mongoose connect downbelow
//then make the model.... see model post

const mongoose = require('mongoose');

//file upload multer..
const multer = require('multer');

const { v4: uuidv4 } = require('uuid');

const fileStorage = multer.diskStorage({
    //destination of where files should be saved
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    //naming function
    filename: function(req, file, cb)  {
        //callback, null as error, then filename
        cb(null, uuidv4())
    }
});

const fileFilter = (req, file, cb) => {
    //if file type is one of these
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ) {
        //if file is correct
        cb(null, true);
    } else {
        cb(null, false);
    }
};



//start app with express functiion

const app = express();



//initial body parser, parases incoming requests
app.use(bodyParser.json()); //app/json

//more multer for file image.... filestorage and filter set up above

app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter}).single('image')
);



//image stuff, path.join allows to make the path to this folder and images adds that
app.use('/images', express.static(path.join(__dirname, 'images')));

//middleware that stops CORS error (sharing info from server and browser) 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});



app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);






//error middleware

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data:data});
});


//2 conect to server
mongoose.connect(
    'mongodb+srv://Sealyoulater:Okayiguess!123@cluster0.lctpx.mongodb.net/messages')
.then(result =>{
    //socket stuff: have to make server const and p[ass to io]
    const server = app.listen(8080);
    const io = require('./socket').init(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
           }
    });
    io.on('connection', socket => {
        console.log('Client connected')
    });
})
.catch(err => console.log(err));

//listen to incoming requests



