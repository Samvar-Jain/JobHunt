const mongoose = require("mongoose");
const URI = "mongodb+srv://shivam9198:Bangtk1230@jobhunt.iccjgmf.mongodb.net/jobHunt";

const dbConnect = async()=>{
 try {
    await mongoose.connect(URI);
 } catch (error) {
    console.log(error)
 }

}
module.exports = dbConnect;

