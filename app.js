const express = require('express');
const bodyParser = require('body-parser')
const feedRoutes = require('./routes/feed')

//start app with express functiion

const app = express();



//initial body parser
app.use(bodyParser.json()); //app/json



app.use('/feed', feedRoutes);





//listen to incoming requests
app.listen(8080);



