import express from "express"

//note
// Always load environment variables FIRST before using them anywhere else
import dotenv from "dotenv";
dotenv.config();


import app from "./app.js"
import connectDb from "./config/connect.js";



app.on("error",(error)=>{
    console.log("Error",error);
    throw error;
})

connectDb()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`server is running at port : ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MONGO DB connection failed ",err);
})