import express from "express"
import dotenv from "dotenv";
import app from "./app.js"
import connectDb from "./config/connect.js";

dotenv.config();

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