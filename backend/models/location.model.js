import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    city: String,
    state: String,
    
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    }


},{
    timestamps:true
})



export default mongoose.model("Location", locationSchema);