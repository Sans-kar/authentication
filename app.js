require("dotenv").config();


const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
const { config } = require("dotenv");

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));


// database 
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});


const User=mongoose.model("User",userSchema);



app.get("/",function(req,res){
    res.render("home");
})


app.get("/register",function(req,res){
    res.render("register");
})


app.get("/login",function(req,res){
    res.render("login");
})

// post request
app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
})

app.post("/login",function(req,res){
    const email=req.body.username;
    const password=req.body.password;
    User.findOne({email:email},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets");
                }else{
                    console.log("username or password is incorrect");
                }
                
            }else{
                console.log("User not found");
            }
        }
    })
})


app.listen(3000,function(req,res){
    console.log("server is running");
})