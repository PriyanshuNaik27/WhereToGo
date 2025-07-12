import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
    refreshToken:{
        type:String
    }
    
},{
    timestamps:true
})


//dont write callback in arrow function as .this does not 
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password,10);
    next();
} )


//make a method to check ispasswordcorrect 
userSchema.methods.isPasswordCorrect = async function
(password){
    return await bcrypt.compare(password,this.password) //give true or false
}


userSchema.methods.generateAcessToken = function(){
   return  jwt.sign({
        _id: this._id,
        email:this.email,
        userName:this.userName
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return  jwt.sign({
        _id: this._id,
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}


export default mongoose.model("User",userSchema);