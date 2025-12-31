import mongoose from "mongoose";
import { DB_name } from "../constant.js";


const connectDB = async ()=> {
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`)
        console.log(`\n mongodb connected !! db host : ${connectionInstance.connection
            .host}`);
         } catch (err) {
                console.error("MongoDB connection failed");
                throw err;
              }
       
}

export default connectDB