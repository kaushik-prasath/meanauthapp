//MODULES
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

//USER MODULES
const users = require('./routes/users'); 
const config = require('./config/database');

//MONGOOSE
mongoose.connect(config.database);
//on connection
mongoose.connection.on('connected',()=>{
    console.log('Connected to database'+config.database);
});
//on error
mongoose.connection.on('error',(err)=>{
    console.log('Database error:'+err);
});
//SETUP
const app = express();
const port = 4000;

//MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//static
app.use(express.static(path.join(__dirname, 'public')));

//ROUTES
app.use('/users',users);


//LISTEN
app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})