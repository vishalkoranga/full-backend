import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/index.js";


connectDB();









/*
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`);
    console.log("✅ MongoDB connected");
    app.on("error",(error)=>{
        console.log("err:", error);
        throw error
    }) 

    app.listen(process.env.PORT, ()=>{
        console.log(`app is listening on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.error("❌ ERROR:", error);
    throw error;
  }
})();
*/