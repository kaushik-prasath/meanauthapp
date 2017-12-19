//MODULES
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

//USER MODULES
var User = require('./../models/user');
var config = require('./../config/database');


//REGISTER
router.post('/register',(req,res,next)=>{
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    User.addUser(newUser,(err,user)=>{
        if(err){
            res.json({success:false,msg:'Failed to register user.'});
        }else{
            res.json({success:true,msg:'Successfully registered user.'})
        }
    })
});

//AUTHENTICATE
router.post('/authenticate',(req,res,next)=>{
   const username = req.body.username;
   const password = req.body.password;

   User.getUserByName(username,(err,user)=>{
    if(err) throw err;
    console.log(user);
    if(!user){
        return res.json({success:false,msg:'User not found'});
    }

    User.comparePassword(password,user.password,(err,isMatch)=>{
        if(err) throw err;
        if(isMatch){
            const token = jwt.sign(user.toJSON(),config.secret,{
                expiresIn: 604800
            });
        
        res.json({
            success:true,
            token:'JWT '+token,
            user:{
                id: user._id,
                name: user.name,
                username:user.username,
                email:user.email
            }
        });
        }else{
            return res.json({success:false,msg:'Wrong password'});            
        }
    });
   });
});

//PROFILE
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    res.json({user: req.user})
});



module.exports = router;