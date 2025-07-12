import mongoose, { mongo } from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required :true

    },
    fromLocation :{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Location",
        required:true,
    },
    toLocation :{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Place",
        required:true,
    },
    cost :Number,
    numberOfPeople:Number,
    stayDetails :String,
    rating :{
        type:Number,
        min:1,
        max:5
    }, 
     description: String
}, { timestamps: true });


export default mongoose.model("Review",reviewSchema);