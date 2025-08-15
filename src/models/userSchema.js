const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt  = require("bcrypt")
const userSchema = new mongoose.Schema({
    firstName :{
        type: String,
        required : true,
    },
    lastName: {
        type: String,
        required : true,
    },
    email:{
        type:String,
        required : true,
        unique:true

    },
    password :{
        type : String,
        required: true,
    },
    profilePic:{
        type : String,
        

    }
},{timestamps: true})

userSchema.methods.getjwt = async function(){
    const user =  this;
    const token = await jwt.sign({_id:user._id},"JobHunt");
    return token;

}


userSchema.methods.verifyPassword = async function(password){
 const isMatch =  await bcrypt.compare(password,this.password);
 return isMatch;
}

module.exports  = mongoose.model("User" , userSchema);