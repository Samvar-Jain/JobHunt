const mongoose = require("mongoose");
const User = require("./userSchema")

const jobSchema = new mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref : User,// referance to the user model
    required:true
   },
   title:{
    type:String,
    required:true,
    trim:true

   },
   company:{
    type:String,
    trim:true,
    required:true
   },
   location:{
    type:String,
    required:true,
    trim:true
   },
   status:{
    type:String,
    enum:["Applied","Interviewing","Rejected","Offered"],
   default:"Applied"
   },
   date:{
    type:Date,
    default:Date.now

   },
   jobPosition:{
    type:String,
    enum:["Internship","Full Time","Part Time"],
    default:"Full Time"
   },
   jobType:{
   type:String,
   enum:["onsite","Hybrid","Work from home"],
   default:"onsite",
   }

},{timestamps:true})

module.exports = mongoose.model("jobStatus",jobSchema);
