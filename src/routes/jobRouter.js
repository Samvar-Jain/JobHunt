const express = require("express");
const jobRouter = express.Router();
const userAuth = require("../middleware/userAuth");
const { validateaddPost } = require("../utils/validate");
const Jobs = require("../models/jobs");

// add a job
jobRouter.post("/addPost", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { title, company, status, location, date, jobPosition, jobType } =
      req.body;
    validateaddPost(req);
    const job = new Jobs({
      user: user._id,
      title: title,
      company: company,
      status: status,
      location: location,
      date: date,
      jobPosition: jobPosition,
      jobType: jobType,
    });
    await job.save();
    res.status(200).send("your application is saved sucessfully");
  } catch (error) {
    res.send(error.message);
  }
});
// update a job
jobRouter.post("/deletepost/:job_id", userAuth, async (req, res) => {
  const job_id = req.params.job_id.trim();
  try {
    if (!job_id) {
      throw new Error("job_id requires");
    }
    const job = await Jobs.findOneAndDelete({ _id: job_id });
    if (!job) {
      throw new Error("job not Found");
    }
    res.status(200).json({
      message: "job post Delete sucessfully",
    });
  } catch (error) {
    res.send(error.message);
  }
});
// delete a job
jobRouter.patch("/updatepost/:job_id", userAuth, async (req, res) => {
  const job_id = req.params.job_id.trim();
  const { jobType, jobPosition, status, location, company, title } = req.body;
  try {
    if (!job_id) {
      throw new Error("job Id not found");
    }
    const updateAllowed = [
      "jobType",
      "jobPosition",
      "status",
      "location",
      "company",
      "title",
    ];
    const updates = {};
    // filter field
    for (let keys of updateAllowed) {
      if (req.body[keys] !== undefined) {
        updates[keys] = req.body[keys];
      }
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }
    if(updates.status && !["Applied","Interviewing","Rejected","Offered"].includes(updates.status)){
        return res.status(400).json({message:"status is not valid!!"})
    }
     if(updates.jobPosition && !["Internship","Full Time","Part Time"].includes(updates.jobPosition)){
        return res.status(400).json({message:"jobPsition is not valid!!"})
    }
     if(updates.jobType && !["onsite","Hybrid","Work from home"].includes(updates.jobType)){
        return res.status(400).json({message:"jobPsition is not valid!!"})
    }
    const job = await Jobs.findOneAndUpdate({ _id: job_id }, updates, {
      new: true,
    });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    res.send(error.message);
  }
});
//get all the job
jobRouter.get("/jobs",userAuth,async(req,res)=>{
    const logiinUser  = req.user;
    try {
        if(!logiinUser){
            res.status(400).send("please login!!")
        }
        const jobs = await Jobs.find({ user: logiinUser })
        res.status(200).json({message:"All jobs ",jobs})
    } catch (error) {
        res.send(error.message)
    } 
})
module.exports = jobRouter;

//read all job
//update job
// delete job
