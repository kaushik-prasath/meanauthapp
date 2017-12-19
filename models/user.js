//MODULES
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//USER MODULES
const config = require('./../config/database');


const UserSchema = mongoose.Schema({
    name:{
        type:String
    },
    username: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

var User = module.exports = mongoose.model('User',UserSchema);

//FIND USER BY ID
module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
};

//FIND USER BY NAME
module.exports.getUserByName = function(username,callback){
    var query = {username:username};
    User.findOne(query,callback);
};

//ADDING USER TO DB
module.exports.addUser = function(newUser,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};


module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
        if(err) throw err;

        callback(null,isMatch);
    });
}