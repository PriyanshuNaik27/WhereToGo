import mongoose from "mongoose";

// Make sure dotenv.config() is called in index.js before this file is imported
if (!process.env.MONGO_URI) {
    console.log("MONGO_URI is missing in environment variables");
}


const connectDb = async()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to mongo  ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("error while connecting to mongo",error);
        process.exit(1);
    }
}

export default connectDb;