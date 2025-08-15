const User = require("../models/userSchema");
const jwt = require('jsonwebtoken');
const userAuth = async(req,res,next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error("please login");
        }
        const decodedMessage = await jwt.verify(token,"JobHunt");
        if(!decodedMessage){
            throw new Error("Invalid Token")
        }
        const{_id} = decodedMessage;

const user = await User.findById({_id});
     if(!user){
    throw new Error("user not found");
}
req.user = user;
next();

    } catch (error) {
          console.error(error);
        return res.status(500).json({ error: "Authentication failed" });
    }

}

module.exports = userAuth;