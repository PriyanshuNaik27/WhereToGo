import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    
},{
    timestamps:true
})


export default mongoose.model("User",userSchema);