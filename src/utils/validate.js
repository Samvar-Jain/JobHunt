const validator = require("validator");
const validateSignup = (req)=>{
    const{firstName, lastName, email, password  } = req.body;
        if(!firstName || !lastName){
            throw new Error("Name is not valid!!");
        }
        if(!email){
            throw new Error("email is required !!");
        }
        if(!password){
            throw new Error ("password is required !!")
        }
        if(!validator.isEmail(email)){
              throw new Error ("email is not valid !!")
        }
        if(!validator.isStrongPassword(password)){
            throw new Error("Please Enter a Strong Password !!")
        }
}

const validateLogin = (req)=>{
    const {email} = req.body;
    if(!validator.isEmail(email)){
        throw new Error("email is not valid !!");
    } 
}

const validateaddPost = (req)=>{
      const{title,company,status,location,date,jobPosition,jobType}= req.body;
      if(!title){
        throw new Error("please Enter title");
      }
       if(!company){
        throw new Error("please Enter company name");
      }
       if(!location){
        throw new Error("please Enter location");
      }
}
module.exports = {
        validateLogin,   
    validateSignup,
    validateaddPost
};