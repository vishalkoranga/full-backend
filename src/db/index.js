import mongoose from "mongoose";
import { DB_name } from "../constant.js";


const connectDB = async ()=> {
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`)
        console.log(`\n mongodb connected !! db host : ${connectionInstance.connection
            .host}`);
    } catch (error) {
        Console.log("mongodb connection error" ,error);
        process.exit(1)
    }
}

export default connectDB