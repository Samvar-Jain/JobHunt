const express = require("express");
const authRouter = express.Router();
const {validateSignup, validateLogin} = require("../utils/validate");
const bcrypt = require("bcrypt");
const User  = require("../models/userSchema")

authRouter.post("/signup",async(req,res)=>{
 
    try {
        const {firstName , lastName , email, password} = req.body;
        validateSignup(req);
        // cheak user already exist or not
        const findUser = await User.findOne({email:email});
        if(findUser){
            throw new Error("Account already Exist please login !!")
        }
        // encrypting the password
      const hashPassword = await bcrypt.hash(password,10);
      console.log(hashPassword);
      const user   = new User({firstName, lastName, email, password:hashPassword});
      const savedUser = await user.save();
      const token  = await savedUser.getjwt();
      res.cookie("token",token, { expires: new Date(Date.now() + 8 * 3600000),});
      res.json({message:"data saved sucessfully",savedUser}).status(200); 
        
    } catch (err) {
       res.status(400).json(err.message); 
    }
})

authRouter.post("/login",async(req,res)=>{
    const {email, password} = req.body;
try {
   validateLogin(req);
   // cheak use exist in the database or not
   const foundUser = await User.findOne({email:email});
   if(!foundUser){
    throw new Error("user not found !!");
   }
   const validPassword = await foundUser.verifyPassword(password);
   if(!validPassword){
    throw new Error("Invalid credentials !!");
   }
   const token  = await foundUser.getjwt();
   res.cookie("token", token ,{ expires: new Date(Date.now() + 8 * 3600000),});

   res.status(200).json({
    message:"Login sucessfully!!",
    foundUser
   })
    
} catch (error) {
    res.status(400).json({
        message: error.message
    })
}
})
authRouter.post("/logout",async(req,res)=>{
    res.clearCookie("token");
    res.send("logout sucessfully");
})
module.exports = authRouter;